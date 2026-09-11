---
name: spec
description: Create, update, execute, or review an explicitly requested specification artifact.
---

# Spec-driven work

Use this skill only when the user's primary target is a specification artifact: creating a spec, editing or approving a spec, executing a named/identified spec, or reviewing/checking a spec. The specification is the single source of truth for scope and acceptance.

Do not use this skill for ordinary implementation, investigation, planning, review, or operational requests merely because they could benefit from a spec. A request must explicitly identify a spec as its subject (for example, by saying “spec”, naming a spec ID, or referencing a spec path).

## Core rules

- Do not implement, modify files, or make product, public API, architecture, release, destructive, credential, or irreversible decisions until the user has explicitly approved the spec.
- Treat an approved spec as the execution boundary. Do not add related cleanup, refactors, features, or compatibility changes unless the user approves a spec update.
- If requirements are ambiguous, safely verify factual context first. Ask concise questions for any remaining material ambiguity.
- Keep the spec current: record material decisions, scope changes, validation evidence, blockers, every status transition, and the final result in it.
- Never claim an acceptance criterion passed without objective validation evidence.

## Spec lifecycle

Use exactly one of these statuses in the front matter:

```text
draft <--> approved --> in_progress <--> done
```

- `draft`: being written, clarified, or awaiting explicit user approval; never execute work.
- `approved`: the user explicitly approved this version; execution may begin.
- `in_progress`: implementation or validation is active. Record blockers and the exact next decision/action in `# Execution log` without adding another status.
- `done`: every acceptance criterion has evidence, and the user explicitly approved completion. Keep the status `in_progress` while awaiting that approval.

A material change to goal, scope, constraints, interface, acceptance criteria, or risk returns the spec to `draft` before doing the affected work.

## Workflow

### 1. Create or update the spec

Store task specs in `.agents/specs/<id>/SPEC.md` by default. If the project's system prompt explicitly specifies a spec location, use that location instead. Do not infer an alternate path merely because a repository has a similarly named directory. Use `<id>` in the form `<YYYYMMDD>_<2-digit-sequence>_<kebab-case-slub>` (for example, `20260910_01_hello-world`). Determine the next sequence by inspecting existing specs for the same date.

Capture the user's intent precisely. Make unknowns explicit rather than filling them with assumptions. For lightweight requests, a compact spec is acceptable, but it must still state scope and validation.

### 2. Request approval

When the spec is complete, keep `status: draft` and present a concise summary of:

- goal and in-scope work;
- non-goals;
- decisions or risks needing approval;
- acceptance criteria and validation plan.

Ask for explicit approval. Do not interpret silence, a request for a draft, or general positive feedback as approval to execute.

### 3. Execute the approved spec

Before changing anything, re-read the spec and confirm it is `approved`. Follow the host agent's planning, delegation, safety, and validation rules. Update the status to `in_progress` while work is active.

If new information makes the approved spec incomplete or unsafe, stop the affected work, record the issue in `# Execution log`, set `draft`, and ask the user.

### 4. Verify and close

Validate each acceptance criterion, then add the exact command, check, or manual observation and its result under `## Validation`. Keep the status `in_progress`, record that work is ready for approval in `# Status log`, and ask the user to approve completion.

Set `done` only after the user explicitly approves completion. Record the approval and the `in_progress -> done` transition in `# Status log`. Provide a concise final report covering changed files, validation, and remaining risks or blockers.

## Template

```md
---
id: <YYYYMMDD>_<2-digit-sequence>_<kebab-case-slub>
title: <short title>
status: draft
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---

# Goal
<Outcome for the user, not merely an implementation activity.>

# Scope
- <Included change>

# Non-goals
- <Explicitly excluded work>

# Constraints and decisions
- <Approved technology, compatibility, security, performance, or operational constraint>

# Open questions
- [ ] <Question that must be answered before approval, or `None`>

# Acceptance criteria
- [ ] <Observable outcome>
- [ ] <Validation requirement>

# Implementation plan
- [ ] <Small, ordered execution step; add after approval if discovery is needed>

# Validation
- Pending

# Decision log
- <YYYY-MM-DD> — <Decision, approver, and reason>

# Status log
- <YYYY-MM-DD> — `draft -> approved` — <User approval or reason for transition>

# Execution log
- <YYYY-MM-DD> — <Material progress, scope change, or blocker>
```

## Output style

Write specs and user-facing summaries in the user's language. Keep implementation identifiers, commands, file paths, and quoted source text unchanged. Be concise: include only details needed to establish scope, approval, execution, and verification.
