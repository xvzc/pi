---
name: spec-driven-development
aliases: [sdd]
description: Use when turning natural-language product or feature requests into explicit specifications, acceptance criteria, and implementation-ready plans. Once the specification is complete, transition into plan-driven-development for planning and execution.
---

# Spec-Driven Development

Turn a natural-language feature request into durable development artifacts before implementation. This skill follows the GitHub Spec Kit mental model: constitution/principles → specification → clarification → plan → tasks → implementation.

This is an upstream skill for `plan-driven-development`: use it to decide **what** should be built and how success will be observed. When the spec is complete and the immediate next action is technical planning or execution, load `plan-driven-development` and follow that skill for the rest of the work.

## When to Use

Use this skill when the user asks for spec-driven development, feature specification, requirements definition, acceptance criteria, or a natural-language product request that needs to be shaped before coding.

Do not use it for narrow, already-specified, reversible edits where direct implementation is safer and clearer.

## Core Principles

- Treat user text as intent, not a complete specification.
- Ask only for consequential ambiguity: product behavior, public API, compatibility, data model, security, privacy, migration, production impact, or irreversible choices.
- Make routine, reversible choices using existing project conventions and document assumptions.
- Keep implementation details out of the spec unless the user explicitly constrains them.
- Do not begin implementation from an unstable or unresolved spec.
- Do not load `plan-driven-development` until the spec is sufficiently complete and the immediate next action is planning, task materialization, or execution.

## Workflow

1. **Specify** — Load `references/specification.md` immediately before drafting or revising the spec. Capture goal, scope, user stories, functional requirements, acceptance criteria, edge cases, non-goals, assumptions, and unresolved questions.
2. **Clarify** — Load `references/clarification.md` immediately before deciding whether to ask questions or proceed on assumptions. Ask the minimum necessary questions; otherwise record assumptions and continue.
3. **Converge** — Confirm that the spec has no blocking ambiguity and that success criteria are testable. If artifacts are warranted, write/update project-local spec files without secrets.
4. **Transition** — Load `references/transition-to-plan.md` immediately before handing off to `plan-driven-development`. Translate spec outcomes into planning inputs: constraints, acceptance checks, non-goals, risks, and stop conditions.
5. **Execute via plan-driven-development** — Load and follow `plan-driven-development` only after the above transition is the immediate next action.

## Artifact Guidance

Prefer project-local artifacts when the request is non-trivial or explicitly spec-driven:

```text
specs/<feature-slug>/spec.md
specs/<feature-slug>/plan.md      # owned by plan-driven-development
specs/<feature-slug>/tasks.md     # owned by plan/task execution flow when useful
```

For small tasks, a concise in-conversation spec is enough if it preserves acceptance criteria and assumptions.

## Output Contract

When reporting a completed spec phase, include:

1. Spec location or inline summary.
2. Key acceptance criteria.
3. Assumptions made without asking.
4. Open questions or explicit statement that none are blocking.
5. Whether the next step is plan-driven development, implementation, or user decision.
