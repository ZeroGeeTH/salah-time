# AgentFlow Defect — DEFECT-001

```yaml
defect_id: DEFECT-001
related_task_id: TASK-SYS-001
severity: high
cycle: 1

summary: >
  dispatcher.py silently fails to update Leantime ticket status because
  the JSON-RPC params format is incorrect. The API returns an error response
  with HTTP 200, which the current code does not detect.

expected_behavior: >
  After Codex finishes writing files and pushing the branch,
  Leantime ticket status is updated to 4 (In Progress) at start
  and 2 (Waiting for Approval) at end.
  If either update fails, the script exits with a non-zero code.

actual_behavior: >
  update_leantime_status() sends { params: { id: ..., values: { status: ... } } }
  Leantime returns { "result": { "msg": "project id is not set", "type": "error" } } with HTTP 200.
  The function does not check the response body for errors, so it silently continues.
  The ticket status never changes in Leantime.

steps_to_reproduce:
  - Run dispatcher.py with valid AGENTFLOW_TICKET_ID=1961
  - Observe GitHub Actions run completes with conclusion=success
  - Check Leantime ticket 1961 — status remains unchanged

fix_required: >
  In integrations/auto_dispatch/dispatcher.py:

  1. Fix update_leantime_status() params format.
     WRONG:  params: { id: int(ticket_id), values: { status: status } }
     CORRECT: params: { values: { id: int(ticket_id), status: status, projectId: 43 } }

  2. Add response validation after request_json() call.
     If result is a dict with "type": "error" or has an "error" key, raise RuntimeError.

  3. The projectId must be passed into update_leantime_status() as a parameter
     (do not hardcode 43 — read it from AGENTFLOW_PROJECT_ID env var with default 43).

test_requirements:
  - Add AGENTFLOW_PROJECT_ID=43 to GitHub Actions workflow inputs and env
  - After fix: run dispatcher.py against ticket 1961
  - Verify Leantime ticket changes to status 4 (In Progress) at start
  - Verify Leantime ticket changes to status 2 (Waiting for Approval) at end
  - If Leantime API returns error, script must exit with code 1
```

## Defect Readiness Check

- [x] Defect is reproducible
- [x] Expected and actual behavior stated
- [x] Steps to reproduce are specific
- [x] Fix scope is limited to dispatcher.py and agentflow-dispatch.yml only
