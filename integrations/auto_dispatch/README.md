# AgentFlow Automatic Dispatch

This integration closes the current dispatch gap by letting n8n trigger a
GitHub Actions workflow whenever a Leantime ticket reaches status `3` (`New`).
The GitHub Actions job runs a developer-agent dispatcher, commits generated
code to the target repository, pushes the task branch, and moves the Leantime
ticket to status `2` (`Waiting for Approval`).

## Chosen Option

Option D — GitHub Actions.

Reason:

- n8n is already live and can call GitHub APIs.
- GitHub Actions runs reliably without adding a persistent server.
- The job has shell and Git access, so it can push real code to GitHub.
- The solution extends the existing n8n workflow instead of replacing it.

## Required Secrets

Configure these in the `ZeroGeeTH/agentflow` GitHub repository:

- `OPENAI_API_KEY`: API key used by the developer agent.
- `AGENTFLOW_GITHUB_TOKEN`: GitHub token with repo write access to target repos.
- `LEANTIME_API_KEY`: Leantime JSON-RPC API key.

The workflow receives the Leantime endpoint, ticket id, task id, task body, and
target repo from n8n through `workflow_dispatch` inputs.

## n8n Extension

Keep the existing workflow through the ready-task branch. After the existing
node that updates a ticket to status `4` (`In Progress`), add the HTTP Request
node described in `n8n/workflow-extension.json`.

That node dispatches:

```text
POST /repos/ZeroGeeTH/agentflow/actions/workflows/agentflow-dispatch.yml/dispatches
```

with the ticket payload from Leantime.

## Runtime Flow

1. n8n polls Leantime every five minutes.
2. n8n filters tickets with status `3`.
3. n8n updates the selected ticket to status `4`.
4. n8n triggers the GitHub Actions workflow.
5. The workflow checks out `agentflow`.
6. The dispatcher clones the target repository.
7. The dispatcher asks the OpenAI API for a file-change plan.
8. The dispatcher writes the files, commits, and pushes the configured branch.
9. The dispatcher updates the Leantime ticket to status `2`.

## Review Notes

The developer prompt is generic and built from the incoming task body. It does
not hardcode `TASK-P01-001`, `salah-time`, or any application file content.

