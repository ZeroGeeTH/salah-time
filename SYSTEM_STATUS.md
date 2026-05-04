# AgentFlow — System Status

**Last updated:** 2026-05-04
**Maintained by:** Claude (Architect + QA)

---

## Current State

AgentFlow is partially operational.
The task management and polling loop are live.
The dispatch leg (n8n → developer agent) is NOT yet implemented.

---

## Infrastructure — What Is Running

| Component | Status | Location |
|---|---|---|
| Leantime (task system) | ✅ Live | https://project.cocofriday.com |
| n8n (automation) | ✅ Live | http://ai.cocofriday.com |
| GitHub — agentflow repo | ✅ Live | https://github.com/ZeroGeeTH/agentflow |
| GitHub — salah-time repo | ✅ Live | https://github.com/ZeroGeeTH/salah-time |
| n8n workflow: Task Dispatcher | ✅ Active | Workflow ID: At8kNctb4ncMEfT9 |

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

1. **Dispatch leg** — n8n cannot yet send task specs to a developer agent automatically
2. **Review trigger** — Claude is not yet notified when code is ready for review
3. **Feedback loop** — defect tasks are not yet created or dispatched automatically

---

## Protocol Reference

Full AgentFlow protocol: AGENTFLOW_PROTOCOL.md
First project architecture: PROJECT_01_ARCHITECTURE.md
Task template: templates/TASK_TEMPLATE.md
