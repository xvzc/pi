# Transition to Plan-Driven Development

This reference governs the handoff from spec-driven development to plan-driven development. Load it immediately before the next action becomes technical planning, task materialization, or execution.

## 1. Confirm spec readiness

Before loading `plan-driven-development`, verify:

- The objective and scope are clear.
- Acceptance criteria are observable.
- Non-goals are explicit.
- Blocking user-owned questions are resolved.
- Remaining decisions are technical planning decisions.

If any item is false, return to specification or clarification instead of planning.

## 2. Prepare planning inputs

Summarize these for `plan-driven-development`:

- Spec artifact path or inline spec summary.
- Functional requirements and acceptance criteria.
- Constraints, assumptions, and non-goals.
- Required validation and review expectations.
- Known risks and stop conditions.
- Any user-approved implementation constraints.

## 3. Preserve phase boundaries

Do not implement during the transition. Do not create execution tasks unless the active plan is already approved and task materialization is warranted by the downstream planning procedure.

## 4. Handoff pattern

Use this handoff shape:

```text
Spec is ready. Next action: plan-driven development.
Planning inputs:
- Scope: ...
- Acceptance: ...
- Constraints: ...
- Non-goals: ...
- Risks/stop conditions: ...
```

Then load `plan-driven-development` and follow its planning/execution references according to the immediate next action.
