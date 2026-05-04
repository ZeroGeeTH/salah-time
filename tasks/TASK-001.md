# AgentFlow Task — TASK-001

```yaml
task_id: TASK-001
title: Implement Task Schema Validator
type: feature
agent: codex
reviewer: claude
priority: high
cycle: 1

objective: >
  Create a Python module `core/task_validator.py` that validates a task dictionary
  (loaded from YAML) against the AgentFlow mandatory task schema.
  The validator must return a structured result indicating VALID or INVALID,
  with a list of specific field errors when invalid.

acceptance_criteria:
  - validate_task(task: dict) function exists and is importable from core.task_validator
  - Returns {"status": "VALID", "errors": []} when all required fields are present and non-empty
  - Returns {"status": "INVALID", "errors": [...]} listing each missing or empty field
  - Required fields checked: task_id, title, type, agent, reviewer, objective,
    acceptance_criteria, constraints, test_requirements, priority, cycle
  - type field must be one of: feature, bug, refactor, test — error if not
  - agent field must equal "codex" — error if not
  - reviewer field must equal "claude" — error if not
  - acceptance_criteria, constraints, test_requirements must be non-empty lists — error if empty list or wrong type
  - A test file tests/test_task_validator.py exists and all tests pass
  - Running `pytest tests/test_task_validator.py` exits with code 0

constraints:
  - Python 3.10 or later
  - No external dependencies beyond PyYAML and pytest (already common)
  - Do not modify any file outside core/ and tests/
  - Do not implement anything beyond task validation (no Leantime, no Git, no n8n)
  - File must be named exactly: core/task_validator.py

test_requirements:
  - test_valid_task: passes a fully populated valid task dict → expects VALID
  - test_missing_task_id: omits task_id → expects INVALID with "task_id" in errors
  - test_empty_objective: passes task with objective = "" → expects INVALID with "objective" in errors
  - test_invalid_type: passes type = "deploy" → expects INVALID with "type" in errors
  - test_empty_acceptance_criteria: passes acceptance_criteria = [] → expects INVALID
  - test_wrong_agent: passes agent = "gpt4" → expects INVALID with "agent" in errors
  - All tests must use pytest conventions (no unittest classes required)

relevant_files:
  - core/task_validator.py   ← CREATE
  - tests/test_task_validator.py   ← CREATE
  - core/__init__.py   ← CREATE (empty, to make core a package)
  - tests/__init__.py   ← CREATE (empty)

architecture_notes:
  - core/ is the foundational package for all AgentFlow logic
  - Validator is stateless — no I/O, no side effects, pure function only
  - Future tasks will extend core/ with dispatcher, agent I/O, integrations
  - Do not add logging, CLI, or configuration loading in this task
  - Keep the function signature: validate_task(task: dict) -> dict

git_instructions:
  - Branch from main: git checkout -b feature/TASK-001-task-validator
  - Commit message format: "TASK-001: Add task schema validator with tests"
  - Do not push or merge — report branch name and commit hash only
```

---

## Codex Readiness Check

- [x] Task has a single focused objective
- [x] Acceptance criteria are measurable and executable
- [x] Constraints are explicit
- [x] Test requirements name specific test cases with input and expected output
- [x] No missing requirements — all fields defined above
- [x] No external service dependencies
- [x] Independently testable with `pytest`
