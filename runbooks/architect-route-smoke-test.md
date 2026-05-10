# Open WebUI Architect-Route Smoke Test Runbook

## Purpose
This runbook describes the steps necessary to execute a smoke test for the Open WebUI architect-route functionality. The goal is to verify that the architect-route is working correctly after deployment or major code changes.

## Prerequisites
- Access to the deployed Open WebUI environment (staging or production).
- Required credentials and permissions to access the WebUI.
- Relevant endpoints, URL, or IP for the architect-route service.

## Test Steps

1. **Navigate to Open WebUI**
    - Open a browser and go to the Open WebUI URL (e.g., `https://<your-webui-domain>/`).

2. **Authenticate**
    - Log in using valid credentials (ensure you have architect permissions, if required).

3. **Locate Architect-Route Feature**
    - Identify and click through to the architect-route section on the interface.

4. **Run Basic Architect-Route Operation**
    - Initiate an architect-route via the WebUI.
    - Provide minimal required parameters for routing.
    - Click the action button (e.g., "Route" or "Start").

5. **Observe & Validate**
    - Ensure non-error response (no UI errors, successful feedback message, or returned data).
    - Architect-route task should complete successfully.
    - Confirm expected routing changes (e.g., correct assignment, logs, or result display).

6. **Logout**
    - Sign out to ensure session ends cleanly.

## Rollback or Failure Steps
- If any smoke test step fails, collect:
    - Console logs (browser devtools)
    - WebUI error messages
    - Timestamps and test user details
    - Notify the relevant engineering team for investigation.

## Success Criteria
- All UI elements related to architect-route are accessible.
- Architect-route can be run with minimal input and returns a positive status.
- No errors or crashes observed during the process.

---

_Last Updated: {{date}}
