# Project 01 Readiness

## Purpose

This file prepares the first AgentFlow project without starting implementation.
It translates the universal protocol into an operating checklist for the first
project cycle.

## Current Status

- Application code: not started
- Architecture: required from Claude
- Task source: required from Leantime or a provided task export
- Active Codex task: none
- Git repository: not initialized in this workspace
- Deployment: not authorized

## Required Before Implementation

Codex can begin only after receiving one complete task with:

- `task_id`
- `title`
- `type`
- `agent`
- `reviewer`
- `objective`
- `acceptance_criteria`
- `constraints`
- `test_requirements`
- `priority`
- `cycle`

The task must also include any relevant architecture notes, file paths, and
repository instructions.

## First Project Operating Loop

1. Claude defines or validates the project architecture.
2. Claude creates the first small implementation task.
3. The task is entered into Leantime.
4. Codex receives exactly one ready task.
5. Codex inspects the repository and implements only that task.
6. Codex runs the required verification.
7. Codex reports changed files, tests, assumptions, and blockers.
8. Claude reviews the result.
9. If review fails, Claude creates a structured defect task.
10. Codex fixes only the assigned defect task.
11. Human approves completion and deployment decisions.

## Codex Guardrails

- Do not design product architecture.
- Do not create missing requirements.
- Do not implement without a complete task.
- Do not modify unrelated modules.
- Do not run deployment steps without explicit approval.
- Do not use production data for testing.
- Work on one active task at a time unless coordination is explicitly defined.

## Open Items

- Project name is not provided.
- Product objective is not provided.
- Architecture is not provided.
- Repository location is not provided.
- Leantime access or export format is not provided.
- Git branch and commit convention are not provided.
- Test command requirements are not provided.

