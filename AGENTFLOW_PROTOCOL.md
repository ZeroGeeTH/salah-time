# AgentFlow Protocol (Universal)

## PURPOSE

This document defines the standard operating model for AgentFlow.

AgentFlow is a multi-agent AI workflow system where:
- Tasks are created and managed in Leantime
- AI agents perform implementation and review
- Work is executed in controlled loops until completion

This protocol is universal and must be applied to ALL projects.

---

## SYSTEM OVERVIEW

AgentFlow consists of the following components:

- Architect + QA Agent: Claude
- Developer Agent: GPT / Codex
- Task System: Leantime
- Source Control: Git
- Automation Layer: n8n / scripts
- Human: Final decision maker

---

## CORE PRINCIPLES

1. Strict role separation:
   - Claude MUST NOT implement code
   - Codex MUST NOT design system architecture

2. Task-driven execution:
   - No work is performed without a task
   - Tasks must be structured and complete

3. Small iterative loops:
   - Work is done in small, verifiable units
   - Each task must be independently testable

4. No assumption policy:
   - Agents must not guess missing requirements
   - Missing information must be flagged

5. Human oversight:
   - Final approval always requires human validation

---

## WORKFLOW

1. Claude creates or validates task specifications
2. Tasks are stored in Leantime
3. Codex receives a single task
4. Codex implements the task
5. Code is verified (tests/build)
6. Claude reviews results
7. If defects are found:
   - Claude creates defect tasks
8. Codex fixes defects
9. Loop continues until task passes
10. Human approves completion
11. Deployment occurs only after approval

---

## AGENT ROLES

### Claude (Architect + QA)

Responsibilities:
- Define system architecture
- Create structured tasks
- Define acceptance criteria
- Review code changes
- Identify and classify defects
- Validate correctness and safety

Limitations:
- Cannot execute code
- Cannot access systems unless data is provided
- Must rely on input context

---

### Codex / GPT (Developer Agent)

Responsibilities:
- Implement assigned tasks
- Modify code in repository
- Run tests/builds if available
- Fix defects
- Report changes clearly

Limitations:
- Cannot define architecture
- Cannot make product decisions
- Cannot assume missing requirements
- Cannot deploy unless explicitly instructed

---

### Human

Responsibilities:
- Validate direction and outcomes
- Approve final deployment
- Resolve ambiguity when agents cannot decide

---

## TASK STANDARD (MANDATORY)

All tasks MUST follow a structured format.

Minimum required fields:

- task_id
- title
- type (feature / bug / refactor / test)
- agent (codex)
- reviewer (claude)
- objective
- acceptance_criteria (required)
- constraints
- test_requirements
- priority
- cycle

Tasks MUST:
- Be small and focused
- Be independently testable
- Contain clear acceptance criteria

---

## DEFECT STANDARD

All defects MUST include:

- defect_id
- related_task_id
- severity
- summary
- expected_behavior
- actual_behavior
- steps_to_reproduce
- fix_required
- cycle

Defects MUST:
- Be reproducible
- Be specific
- Not be speculative

---

## INPUT REQUIREMENTS

For Developer Agent (Codex):

- Task specification
- Relevant files or context
- Constraints and architecture notes
- Test requirements

For QA Agent (Claude):

- Task specification
- Code changes (diff or files)
- Test results or logs

---

## OUTPUT REQUIREMENTS

### Codex must provide:

- Summary of changes
- Files modified
- Tests executed and results
- Assumptions made
- Blockers (if any)

---

### Claude must provide:

- PASS or FAIL decision
- Defect reports if FAIL
- Review summary with reasoning

---

## STATUS FLOW (REFERENCE)

Typical task lifecycle:

- Backlog
- Ready
- In Progress
- Ready for Review
- Defect Found
- Fixing
- Ready for Approval
- Done

---

## RISK MANAGEMENT

Key risks:

- Ambiguous tasks → incorrect implementation
- Missing acceptance criteria → misalignment
- Lack of test verification → hidden bugs
- Large tasks → uncontrolled changes
- Weak defect reporting → ineffective fixes

Mitigation:

- Enforce strict task schema
- Keep tasks small
- Always include tests or verification steps
- Require structured defect reports

---

## OPERATIONAL RULES

- Only ONE active task per agent unless coordinated
- Do not modify unrelated modules
- Do not skip review steps
- Do not deploy automatically
- Do not use production data for testing

---

## AUTOMATION EXPECTATION

Automation layer (n8n or scripts) SHOULD:

- Pull tasks from Leantime
- Route tasks to appropriate agent
- Collect outputs
- Trigger review cycles
- Track task cycles

---

## STOP CONDITIONS

A task is complete ONLY when:

- All acceptance criteria are met
- Claude returns PASS
- No critical or high defects remain
- Human approval is granted

---

## FINAL NOTE

AgentFlow is not an application.

It is an AI-driven operational system.

Success depends on:
- Clarity of tasks
- Discipline of execution
- Tight feedback loops
- Proper role separation
