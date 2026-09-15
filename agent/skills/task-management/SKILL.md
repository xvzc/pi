---
name: task-management
description: Use only when materializing an approved or execution-ready plan into task records, updating task state, tracking dependencies during execution, or recording rework. Do not use merely to draft, discuss, review, or revise a plan.
---

# Task Management

Task tracking records work state; it does not authorize scope, implementation,
or delegation.

## When to track work

For narrow, predictable, reversible work without material uncertainty, work
directly with proportionate checks.

Track work with multiple meaningful steps, dependencies, handoffs, extended
validation, or progress that benefits from visibility. If task tools are
unavailable, disclose that and use a concise conversational checklist.

## Do not create tasks during plan-only work

If the user asks only for a plan, proposal, analysis, breakdown, options, or
plan revision, do not create task records yet. Provide the plan
conversationally.

Create tasks only after one of the following is true:

- The user explicitly authorizes execution.
- The user explicitly asks to create or track tasks.
- The current step is execution preparation for an already approved or
  execution-ready plan.

A plan can be complete as a conversational artifact without any `TaskCreate`
calls. Task records are execution-state artifacts, not planning artifacts.

## Creating tasks

- Write task `description` in English unless governing instructions require another language.
- When task materialization is authorized, it is complete only when every task
  required by the approved or execution-ready plan has been created and all
  actual dependencies between those tasks have been recorded.
  Preserve identifiers, paths, commands, and quoted source text.
- Prefer batch creation: before calling `TaskCreate`, finish decomposing the
  approved or execution-ready plan into the complete initial task set, including
  owners, deliverables, acceptance criteria, and actual dependencies. Then
  create all independent initial tasks in one tool-call batch where tool
  semantics allow parallel independent calls. Do not create one task, pause to
  rethink the plan, then create the next task, unless new information from the
  task tool changes what must be created.
- Prefix `subject` and `activeForm` with `[{agent_name}]`, using the
  responsible actor's stable name such as `[main]`, `[reviewer]`, or a named
  subagent handle. Keep the prefix synchronized in both fields.
- Use specific task descriptions: scope, non-goals, expected output,
  validation, risks, and stop conditions as relevant. Never store secrets.
- Set the responsible owner agent when creating the task (`main` for main-agent-owned
  work; the assigned agent role or name for delegated work).
- Use dependencies only for actual task dependencies. When a task cannot
  start without a predecessor's output, record it with `addBlockedBy` immediately
  after creation. Do not add dependencies merely to express a preferred order.

## Updating task state

- Use the latest successful task-tool response as the current state; call
  `TaskGet` only when the state is unknown, may have changed externally, or
  dependency details are needed.
- Set a task to `in_progress` before its work begins. Complete it only when its
  deliverable and required checks are satisfied. Do not delete unfinished work
  to conceal an unsuccessful outcome.
- Record concise, actionable validation evidence, blockers, review findings,
  and handoff context with the task.
- Task creation, ownership assignment, and status changes record work; they do
  not perform it.

## Rework rules

Rework means returning to an existing task because, for some reason, the same
deliverable needs more work. Do not encode workflow-specific reasons here.

- Reopen the affected existing task instead of creating a duplicate task for
  the same deliverable.
- If rework is required because a check, review, or other acceptance step was
  not approved, set that acceptance task back to `pending`, then return to the
  task that needs correction.
- Set the task being reworked to `in_progress` while correction is underway.
- Mark reopened work with `Re:` after the actor prefix in both `subject` and
  `activeForm`, for example `[{agent_name}] Re: ...`.
- Update the reworked task description or metadata with the concrete blocker,
  finding, or failed check that caused the rework.
- Complete the task only after the correction and required focused checks are
  satisfied; the acceptance task can be restarted after that.
- Create a new task only when the required deliverable materially changes.

## Boundaries

The active specification or plan remains the source of truth for scope,
dependencies, and validation. If scope expands, a user-owned decision appears,
or a safety issue emerges, pause affected work and follow the governing
approval rules. A task entry is a record, not authority to perform work.
