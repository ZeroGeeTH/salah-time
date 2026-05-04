# AgentFlow Task — TASK-SYS-001

```yaml
task_id: TASK-SYS-001
title: Implement Automatic Task Dispatch from n8n to Developer Agent
type: feature
agent: codex
reviewer: claude
priority: high
cycle: 1

objective: >
  Close the automation gap in AgentFlow.
  Currently n8n detects a ready task in Leantime but stops — a human must
  manually copy the task spec and send it to a developer agent.

  Your job is to:
  1. Propose the best approach to automate this dispatch
  2. Implement it
  3. The solution must require zero human intervention once a task is set to "New" in Leantime

acceptance_criteria:
  - When a Leantime ticket reaches status 3 (New), n8n detects it within 5 minutes
  - The task spec is automatically sent to a developer agent without human action
  - The developer agent receives the full task content (title, description, acceptance criteria)
  - The developer agent produces code and pushes it to the correct GitHub branch
  - Leantime ticket status is updated to 4 (In Progress) when agent starts
  - Leantime ticket status is updated to 2 (Waiting for Approval) when agent finishes
  - The solution is documented so Claude can review and trigger next cycles

constraints:
  - Do not change the Leantime status mapping (3=Ready, 4=In Progress, 2=Review)
  - Do not modify AGENTFLOW_PROTOCOL.md
  - Do not break the existing n8n workflow — extend or replace nodes only
  - The solution must work with the existing n8n instance at http://ai.cocofriday.com
  - If the solution requires a new service or script, it must run reliably (not just locally on dev machine)
  - Do not hardcode task content — the solution must work for any future task, not just TASK-P01-001

test_requirements:
  - Set Leantime ticket #1961 to status 3 (New)
  - Wait for n8n schedule cycle (max 5 minutes) or trigger manually via POST http://ai.cocofriday.com/webhook/agentflow-trigger
  - Verify the developer agent received the task (check agent output or logs)
  - Verify Leantime ticket updated to status 4 (In Progress) automatically
  - Verify code was pushed to branch feature/TASK-P01-001-html-scaffold in ZeroGeeTH/salah-time
  - Verify Leantime ticket updated to status 2 (Waiting for Approval) after agent finishes

priority: high
cycle: 1

relevant_files:
  - SYSTEM_STATUS.md                   ← read this first — current system state
  - AGENTFLOW_PROTOCOL.md              ← protocol reference
  - tasks/TASK-P01-001.md              ← the task that must be dispatched
  - templates/CODEX_OUTPUT_TEMPLATE.md ← required output format

architecture_notes:
  - n8n is the automation layer — prefer extending the existing workflow if possible
  - n8n has built-in nodes for: OpenAI, GitHub, HTTP Request, Code (JS), Webhook
  - The existing workflow ID is At8kNctb4ncMEfT9 at http://ai.cocofriday.com
  - Leantime stores the full task description in the ticket body (field: description)
  - The salah-time repo is at https://github.com/ZeroGeeTH/salah-time — Codex must push to this repo
  - Claude (QA) will be notified separately when status reaches 2 (Waiting for Approval)

  Possible approaches (evaluate and choose the best):

  Option A — n8n + OpenAI API:
    n8n calls OpenAI API with task prompt → receives code → pushes to GitHub via GitHub API
    Requires: OpenAI API key configured in n8n credentials
    Pros: fully within n8n, no extra service
    Cons: GPT response may need post-processing to extract file content

  Option B — n8n + Anthropic API:
    Same as A but using Claude API as the developer agent
    Requires: Anthropic API key in n8n credentials
    Note: this would make Claude both developer and QA — flag this conflict to human if chosen

  Option C — n8n + custom webhook endpoint:
    n8n sends task to an external agent endpoint (could be a script on a server)
    The endpoint receives the task, runs the agent, pushes code, calls back n8n
    Pros: agent has full shell/git access
    Cons: requires a persistent service

  Option D — GitHub Actions:
    n8n triggers a GitHub Actions workflow via API
    The action runs an AI coding agent inside the repo
    Pros: runs in GitHub, no extra server
    Cons: more complex setup, GH Actions minutes cost

  Evaluate options based on:
  - What API keys or credentials are already available in n8n
  - Reliability and simplicity
  - Whether the solution can push real code to GitHub

git_instructions:
  - Branch: feature/TASK-SYS-001-auto-dispatch
  - Commit message: "TASK-SYS-001: Implement automatic task dispatch to developer agent"
  - Do not push or merge — report branch name and commit hash
  - Any scripts or config files go in: agentflow/integrations/ or agentflow/core/
```

---

## Codex Readiness Check

- [x] Objective is clear — close the dispatch gap
- [x] Acceptance criteria are end-to-end testable
- [x] Constraints are explicit
- [x] Multiple solution paths provided — Codex must evaluate and choose
- [x] System state is fully documented in SYSTEM_STATUS.md
- [x] No missing context — Codex has all endpoints, IDs, and credentials structure
