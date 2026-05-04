# AgentFlow — System Status

**Last updated:** 2026-05-04
**Maintained by:** Claude (Architect + QA)

---

## Current State

**Full AgentFlow loop is operational end-to-end.**
Zero manual steps after a ticket is set to status 3 (Ready).

## Loop Status

| Step | Status |
|---|---|
| Leantime → n8n detect task (status 3) | ✅ Auto (every 5 min) |
| n8n → GitHub Actions dispatch | ✅ Auto (workflow_dispatch) |
| GitHub Actions → OpenAI → push code | ✅ Auto (dispatcher.py) |
| Push code → Leantime status 2 | ✅ Auto (dispatcher.py) |
| GitHub diff → Claude review | ✅ Auto (every 5 min) |
| Claude PASS → GitHub PR created | ✅ Auto (PR title: [AgentFlow ✅ PASS] ...) |
| Claude FAIL → defect ticket + Blocked | ✅ Auto |
| Human merge PR → Leantime status Done | ✅ Auto (GitHub webhook → n8n) |

---

## Infrastructure — What Is Running

| Component | Status | Location |
|---|---|---|
| Leantime (task system) | ✅ Live | https://project.cocofriday.com |
| n8n (automation) | ✅ Live | http://ai.cocofriday.com |
| GitHub — agentflow repo | ✅ Live | https://github.com/ZeroGeeTH/agentflow |
| GitHub — salah-time repo | ✅ Live | https://github.com/ZeroGeeTH/salah-time |
| n8n workflow: Task Dispatcher | ✅ Active | Workflow ID: At8kNctb4ncMEfT9 |
| n8n workflow: Claude Review | ✅ Active | Workflow ID: RXPH8v3U2tHaXG1n |

---

## n8n Workflow — Current Logic

Workflow: **AgentFlow — Task Dispatcher** (active, runs every 5 minutes)

```
[Schedule: every 5 min]
[Manual Webhook: POST /webhook/agentflow-trigger]
        ↓
[GET all tickets — Leantime project 43]
        ↓
[Filter: status = 3 (New = Ready)]
        ↓
[IF has ready task?]
   YES → [Update ticket → status 4 (In Progress)]
         [Log task info]        ← STOPS HERE — no dispatch yet
   NO  → [No Operation]
```

**The gap:** n8n detects a ready task and marks it In Progress,
but does NOT send the task to any developer agent.
A human currently has to copy the task spec and paste it manually.

---

## Leantime — Project

| Field | Value |
|---|---|
| Project name | Salah Time |
| Project ID | 43 |
| API endpoint | POST https://project.cocofriday.com/api/jsonrpc/ |
| Auth header | x-api-key |
| API format | JSON-RPC 2.0 |

### Ticket Status Mapping

| Status ID | Label | AgentFlow Meaning |
|---|---|---|
| 3 | New | Ready — triggers dispatch to developer agent |
| 4 | In Progress | Developer agent is working |
| 2 | Waiting for Approval | Ready for Claude review |
| 1 | Blocked | Defect found / Fixing |
| 0 | Done | Human approved |

### Active Task

| Field | Value |
|---|---|
| Ticket ID | 1961 |
| Task ID | TASK-P01-001 |
| Title | Create HTML/CSS Scaffold for Salah Time App |
| Status | 3 (New = Ready) |
| Priority | High |
| Spec | https://github.com/ZeroGeeTH/agentflow/blob/main/tasks/TASK-P01-001.md |

---

## n8n API Access

| Field | Value |
|---|---|
| Base URL | http://ai.cocofriday.com/api/v1 |
| Auth header | X-N8N-API-KEY |
| Existing workflow ID | At8kNctb4ncMEfT9 |
| Manual trigger URL | POST http://ai.cocofriday.com/webhook/agentflow-trigger |

n8n supports: HTTP Request, Code (JS), GitHub node, OpenAI node,
Schedule Trigger, Webhook, IF, Merge, Set, and all standard nodes.

---

## GitHub Access

Both repos are under account: ZeroGeeTH
gh CLI is configured and authenticated on the local machine.

---

## What Is NOT Yet Built

1. **Human notification** — no push/email when PR is created (optional)
2. **TASK-P01-002+** — next features for Salah Time app not yet created

## n8n Workflows

| Workflow | ID | Trigger |
|---|---|---|
| AgentFlow — Task Dispatcher | At8kNctb4ncMEfT9 | Schedule 5min + webhook |
| AgentFlow — Claude Review | RXPH8v3U2tHaXG1n | Schedule 5min + webhook |
| AgentFlow — PR Merged → Done | jO3J8J3UPYcJVXeQ | GitHub webhook |

## Manual Trigger URLs

| Workflow | URL |
|---|---|
| Task Dispatcher | POST http://ai.cocofriday.com/webhook/agentflow-trigger |
| Claude Review | POST http://ai.cocofriday.com/webhook/agentflow-review |
| PR Merged (test) | POST http://ai.cocofriday.com/webhook/agentflow-pr-merged |

## Known Quirks

- Leantime `addComment` via JSON-RPC stores with `module='tickets'` but UI reads `module='ticket'` → comments don't show in Leantime UI. Switched to GitHub PR as review output instead.
- Leantime addComment correct params: `module`, `entity`, `entityId` top-level; `values.text` + `values.father` (NOT `commentParent`). Returns HTTP 500 (notification crash) but INSERT succeeds.
- Claude Review dedup: checks if open PR exists on GitHub for the branch before running review.
- PR Merged webhook: GitHub salah-time repo → n8n webhook (POST http://ai.cocofriday.com/webhook/agentflow-pr-merged) → update Leantime to status 0 (Done).
- Ticket ID extracted from PR body regex `\[#(\d+)\]`.

## n8n Manual Trigger URLs

| Workflow | URL |
|---|---|
| Task Dispatcher | POST http://ai.cocofriday.com/webhook/agentflow-trigger |
| Claude Review | POST http://ai.cocofriday.com/webhook/agentflow-review |

---

## Protocol Reference

Full AgentFlow protocol: AGENTFLOW_PROTOCOL.md
First project architecture: PROJECT_01_ARCHITECTURE.md
Task template: templates/TASK_TEMPLATE.md
