# AgentFlow — System Status

**Last updated:** 2026-05-04
**Maintained by:** Claude (Architect + QA)

---

## Current State

AgentFlow review loop is live.
Task polling, Claude review, defect creation, and status updates are all automated.
The only remaining manual step: Human final approval before deployment.

## Loop Status

| Step | Status |
|---|---|
| Leantime → n8n detect task | ✅ Auto (every 5 min) |
| n8n → Developer agent dispatch | ⚠️ TASK-SYS-001 pending |
| Codex → push code → GitHub | Manual (Codex does this) |
| GitHub diff → Claude review | ✅ Auto (every 5 min) |
| Claude PASS → notify Human | ✅ Auto (Leantime comment) |
| Claude FAIL → defect ticket | ✅ Auto (new ticket created) |
| Human approval → deploy | 🔴 Manual — by design |

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

1. **Dispatch leg** — n8n → developer agent (TASK-SYS-001 assigned to Codex)
2. **Human notification** — no push notification when PASS comment is posted

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
