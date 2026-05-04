#!/usr/bin/env python3
"""GitHub Actions developer-agent dispatcher for AgentFlow tasks."""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


OPENAI_MODEL = os.environ.get("AGENTFLOW_OPENAI_MODEL", "gpt-4.1")
IN_PROGRESS_STATUS = 4
WAITING_FOR_APPROVAL_STATUS = 2


def require_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def run(args: list[str], cwd: Path | None = None) -> str:
    completed = subprocess.run(
        args,
        cwd=cwd,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    if completed.returncode != 0:
        raise RuntimeError(
            f"Command failed ({completed.returncode}): {' '.join(args)}\n"
            f"{completed.stdout}"
        )
    return completed.stdout.strip()


def request_json(url: str, headers: dict[str, str], payload: dict[str, Any]) -> dict[str, Any]:
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code} from {url}: {body}") from exc
    return json.loads(body) if body else {}


def update_leantime_status(leantime_url: str, api_key: str, ticket_id: str, status: int, project_id: int = 43) -> None:
    payload = {
        "jsonrpc": "2.0",
        "method": "leantime.rpc.tickets.updateTicket",
        "params": {
            "values": {
                "id": int(ticket_id),
                "status": status,
                "projectId": project_id,
            },
        },
        "id": f"agentflow-ticket-{ticket_id}-status-{status}",
    }
    result = request_json(
        leantime_url,
        {
            "Content-Type": "application/json",
            "x-api-key": api_key,
        },
        payload,
    )
    if isinstance(result.get("result"), dict) and result["result"].get("type") == "error":
        raise RuntimeError(f"Leantime update failed: {result['result'].get('msg')}")
    if "error" in result:
        raise RuntimeError(f"Leantime API error: {result['error']}")


def fetch_leantime_ticket(leantime_url: str, api_key: str, project_id: int) -> dict[str, Any]:
    payload = {
        "jsonrpc": "2.0",
        "method": "leantime.rpc.tickets.getAll",
        "id": "fetch-tickets",
        "params": {"projectId": project_id},
    }
    result = request_json(leantime_url, {"Content-Type": "application/json", "x-api-key": api_key}, payload)
    tickets = result.get("result", [])
    if not tickets:
        raise RuntimeError(f"No tickets found in project {project_id}")
    return tickets[0]


def parse_branch(task_body: str, task_id: str) -> str:
    match = re.search(r"Branch(?: from main)?:\s*([A-Za-z0-9._/-]+)", task_body)
    if not match:
        match = re.search(r"Branch for this task:\s*([A-Za-z0-9._/-]+)", task_body)
    if match:
        return match.group(1).strip()
    safe_task_id = re.sub(r"[^A-Za-z0-9._-]+", "-", task_id).strip("-")
    return f"feature/{safe_task_id.lower()}"


def parse_commit_message(task_body: str, task_id: str) -> str:
    match = re.search(r'Commit message(?: format)?:\s*"([^"]+)"', task_body)
    if match:
        return match.group(1).strip()
    return f"{task_id}: Implement assigned AgentFlow task"


def build_agent_prompt(task_id: str, task_title: str, task_body: str) -> str:
    return f"""
You are a developer agent running inside GitHub Actions.

Implement the following AgentFlow task by returning only JSON.
Do not include Markdown fences or prose.

Task ID: {task_id}
Task title: {task_title}

Full task body:
{task_body}

Return this JSON shape:
{{
  "files": [
    {{
      "path": "relative/path/from/repo/root",
      "content": "complete file content"
    }}
  ],
  "notes": ["short implementation note"]
}}

Rules:
- Create or replace only files required by the task.
- Do not include files outside the target repository.
- Do not modify protocol, task, or automation files unless the task explicitly asks.
- File content must be complete and ready to write to disk.
"""


def call_openai(api_key: str, prompt: str) -> dict[str, Any]:
    payload = {
        "model": OPENAI_MODEL,
        "input": [
            {
                "role": "system",
                "content": (
                    "You produce strict JSON file changes for a coding task. "
                    "No Markdown, no commentary, no omitted file content."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        "text": {
            "format": {
                "type": "json_schema",
                "name": "agentflow_file_changes",
                "strict": True,
                "schema": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "files": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "additionalProperties": False,
                                "properties": {
                                    "path": {"type": "string"},
                                    "content": {"type": "string"},
                                },
                                "required": ["path", "content"],
                            },
                        },
                        "notes": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                    },
                    "required": ["files", "notes"],
                },
            }
        },
    }
    response = request_json(
        "https://api.openai.com/v1/responses",
        {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        payload,
    )
    for item in response.get("output", []):
        if item.get("type") == "message":
            for content in item.get("content", []):
                if content.get("type") == "output_text":
                    return json.loads(content["text"])
    raise RuntimeError("OpenAI response did not contain output_text JSON")


def validate_relative_path(path_text: str) -> Path:
    path = Path(path_text)
    if path.is_absolute() or ".." in path.parts:
        raise RuntimeError(f"Unsafe file path from agent: {path_text}")
    return path


def write_files(repo_dir: Path, changes: dict[str, Any]) -> list[str]:
    files = changes.get("files")
    if not isinstance(files, list) or not files:
        raise RuntimeError("Agent response must include at least one file")

    written: list[str] = []
    for file_change in files:
        relative = validate_relative_path(str(file_change["path"]))
        target = repo_dir / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(str(file_change["content"]), encoding="utf-8")
        written.append(str(relative))
    return written


def clone_target_repo(repo: str, token: str, work_root: Path) -> Path:
    target_dir = work_root / "target"
    clone_url = f"https://x-access-token:{token}@github.com/{repo}.git"
    run(["git", "clone", clone_url, str(target_dir)])
    return target_dir


def configure_git(repo_dir: Path) -> None:
    run(["git", "config", "user.name", "agentflow-bot"], cwd=repo_dir)
    run(["git", "config", "user.email", "agentflow-bot@users.noreply.github.com"], cwd=repo_dir)


def main() -> int:
    openai_api_key = require_env("OPENAI_API_KEY")
    github_token = require_env("AGENTFLOW_GITHUB_TOKEN")
    leantime_api_key = require_env("LEANTIME_API_KEY")
    ticket_id = require_env("AGENTFLOW_TICKET_ID")
    task_id = require_env("AGENTFLOW_TASK_ID")
    task_title = require_env("AGENTFLOW_TASK_TITLE")
    target_repo = require_env("AGENTFLOW_TARGET_REPO")
    leantime_url = require_env("AGENTFLOW_LEANTIME_URL")
    project_id = int(os.environ.get("AGENTFLOW_PROJECT_ID", "43"))

    # Fetch full task body from Leantime instead of relying on env var
    ticket = fetch_leantime_ticket(leantime_url, leantime_api_key, project_id)
    task_body = str(ticket.get("description", ""))
    if not task_body:
        task_body = task_title

    branch = parse_branch(task_body, task_id)
    commit_message = parse_commit_message(task_body, task_id)

    update_leantime_status(leantime_url, leantime_api_key, ticket_id, IN_PROGRESS_STATUS, project_id)

    with tempfile.TemporaryDirectory(prefix="agentflow-") as tmp:
        work_root = Path(tmp)
        repo_dir = clone_target_repo(target_repo, github_token, work_root)
        configure_git(repo_dir)
        run(["git", "checkout", "-B", branch], cwd=repo_dir)

        prompt = build_agent_prompt(task_id, task_title, task_body)
        changes = call_openai(openai_api_key, prompt)
        written = write_files(repo_dir, changes)

        run(["git", "add", *written], cwd=repo_dir)
        diff_status = run(["git", "status", "--short"], cwd=repo_dir)
        if not diff_status:
            raise RuntimeError("Agent produced no file changes")

        run(["git", "commit", "-m", commit_message], cwd=repo_dir)
        run(["git", "push", "-u", "origin", branch], cwd=repo_dir)

    update_leantime_status(leantime_url, leantime_api_key, ticket_id, WAITING_FOR_APPROVAL_STATUS, project_id)
    print(
        json.dumps(
            {
                "status": "READY_FOR_REVIEW",
                "ticket_id": ticket_id,
                "task_id": task_id,
                "target_repo": target_repo,
                "branch": branch,
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"AgentFlow dispatch failed: {exc}", file=sys.stderr)
        raise

