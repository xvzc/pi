---
name: spec-driven-development
description: Guide non-trivial software changes through requirements, specification, design, tasks, implementation, verification, and review using repository-local .specs artifacts.
license: MIT
metadata:
  author: https://github.com/xvzc
---


# Spec-Driven Development

Use this skill for non-trivial features, behavior changes, architecture changes, migrations, public API changes, or tasks where intent and implementation could diverge.

The specification is the source of truth.

Code, tests, design decisions, and implementation tasks must conform to the specification. Do not silently redefine intended behavior through implementation.

## Goals

* Make intent explicit before implementation.
* Separate requirements, behavior, design, execution, and verification.
* Keep feature context localized in one directory.
* Make acceptance criteria observable and testable.
* Preserve traceability from requirements to implementation and verification.
* Prevent accidental scope expansion.
* Keep specifications synchronized with intentional behavior changes.
* Avoid unnecessary process overhead for trivial changes.

---

# Directory Structure

Organize specifications by feature.

```text
.specs/
├── constitution.md
├── README.md
│
├── 001-feature-name/
│   ├── requirements.md
│   ├── spec.md
│   ├── design.md
│   ├── tasks.md
│   └── verification.md
│
└── 002-another-feature/
    ├── requirements.md
    ├── spec.md
    ├── design.md
    └── tasks.md
```

Prefer feature-centric organization.

Do not organize primarily by artifact type:

```text
requirements/
design/
tasks/
```

because related feature context becomes scattered across the repository.

Each feature should have one directory containing all artifacts required to understand and execute that change.

---

# Artifact Responsibilities

Each file has a distinct responsibility.

| Artifact          | Responsibility                                  |
| ----------------- | ----------------------------------------------- |
| `constitution.md` | Repository-wide principles and constraints      |
| `requirements.md` | Why the change exists and what must be achieved |
| `spec.md`         | Observable behavior and contracts               |
| `design.md`       | How the specification will be implemented       |
| `tasks.md`        | Executable implementation plan and progress     |
| `verification.md` | Evidence that acceptance criteria are satisfied |

Avoid duplicating the same information across artifacts.

---

# Workflow

Use the following flow:

```text
CONSTITUTION
     ↓
REQUIREMENTS
     ↓
SPECIFICATION
     ↓
DESIGN
     ↓
TASKS
     ↓
IMPLEMENT
     ↓
VERIFY
     ↓
REVIEW
```

For simple changes, use the lightweight flow:

```text
SPEC
 ↓
IMPLEMENT
 ↓
VERIFY
```

Do not create process overhead disproportionate to the task.

---

# 0. Constitution

`.specs/constitution.md` contains repository-wide rules that apply across features.

Examples:

* architecture principles
* backward compatibility policy
* dependency policy
* security requirements
* testing requirements
* migration policy
* maintainability principles
* operational constraints

Example:

```markdown
# Constitution

## Architecture

- Prefer explicit dependencies over hidden global state.
- Preserve existing component boundaries unless the specification requires otherwise.

## Compatibility

- Public APIs must remain backward compatible unless explicitly specified.

## Testing

- Behavior changes require automated verification when reasonably testable.

## Dependencies

- Do not introduce new production dependencies without a concrete requirement.
```

Do not copy these principles into every feature specification.

Feature artifacts inherit the constitution unless they explicitly document an approved exception.

---

# 1. Requirements

Store feature requirements in:

```text
.specs/<feature>/requirements.md
```

Requirements describe **why the change exists and what must be true**.

They must not prematurely prescribe implementation details.

Capture:

* goal
* problem being solved
* functional requirements
* non-functional requirements
* constraints
* assumptions
* explicit non-goals
* unresolved questions

## Format

```markdown
# Requirements

## Goal

...

## Functional Requirements

- R1: ...
- R2: ...

## Non-Functional Requirements

- N1: ...

## Constraints

- C1: ...

## Non-Goals

- ...

## Assumptions

- ...
```

Prefer implementation-neutral requirements.

Bad:

```text
R1: Store sessions in Redis.
```

Better:

```text
R1: Session state must survive application restarts and be shared across application instances.
```

Implementation-specific requirements are acceptable only when the technology itself is explicitly required.

Do not invent requirements merely to simplify implementation.

When ambiguity can be resolved safely, use the narrowest reasonable interpretation and record the assumption.

---

# 2. Specification

Store observable behavior in:

```text
.specs/<feature>/spec.md
```

The specification defines **what the system does**, not how it is implemented.

It should be precise enough that another agent could independently implement and verify the feature.

Define as applicable:

* inputs
* outputs
* state transitions
* public interfaces
* API contracts
* data contracts
* errors
* edge cases
* invariants
* compatibility behavior
* acceptance criteria

## Format

```markdown
# Specification

## Behavior

- S1: ...
- S2: ...

## Inputs

- ...

## Outputs

- ...

## Errors

- ...

## Edge Cases

- ...

## Invariants

- ...

## Acceptance Criteria

- A1: ...
- A2: ...
```

Acceptance criteria must be observable and testable.

Bad:

```text
A1: The implementation should be robust.
```

Better:

```text
A1: If the upstream request times out, the operation returns `ErrUpstreamTimeout` and persisted state remains unchanged.
```

The specification is authoritative for intended behavior.

Implementation must not silently override it.

---

# 3. Design

Store implementation design in:

```text
.specs/<feature>/design.md
```

Design describes **how the specification will be implemented**.

Include as applicable:

* component boundaries
* module responsibilities
* data model
* interfaces
* control flow
* state management
* dependency choices
* migration strategy
* compatibility strategy
* failure handling
* important trade-offs

## Format

```markdown
# Design

## Overview

...

## Components

### Component A

- responsibility
- dependencies

## Data Flow

...

## Interfaces

...

## Decisions

### D1. Decision title

...

## Trade-offs

- ...
```

When changing an existing codebase:

1. inspect existing patterns
2. identify current architecture
3. prefer consistency unless there is a concrete reason to deviate

Prefer the smallest design that satisfies the specification.

Do not introduce abstractions for hypothetical future requirements.

---

# 4. Tasks

Store implementation planning and execution state in:

```text
.specs/<feature>/tasks.md
```

`tasks.md` serves as both:

* implementation plan
* execution progress

Do not create a separate `plan.md` unless the project has a concrete need for one.

A separate plan and task file often duplicate each other.

Each task must:

* have a clear outcome
* correspond to specification items
* identify dependencies when relevant
* include verification work where appropriate
* be small enough to execute and review independently

Use local IDs for dependencies in the same feature. Qualify dependencies from another feature with the complete feature directory basename, for example `000-foundation/T2`.

## Format

```markdown
# Tasks

## T1. Authentication service

- [ ] Add authentication service.
- [ ] Implement credential validation.
- [ ] Add unit tests.

Satisfies:
- S1
- S3
- A1
- A2
- A3

## T2. Session persistence

- [ ] Add session storage interface.
- [ ] Add persistence implementation.
- [ ] Connect session creation.

Satisfies:
- S2
- A4

Depends on:
- T1
```

Tasks should describe outcomes, not merely filenames.

Bad:

```text
- Modify handler.go
- Modify store.go
```

Better:

```text
- Add persistence boundary required by S2.
- Persist session state only after successful credential validation.
```

---

# 5. Traceability

Maintain explicit links between artifacts.

## Feature-Scoped Identifiers

Identifiers are local to their feature directory:

```text
R1  requirement
S1  specification
A1  acceptance criterion
D1  design decision
T1  implementation task
```

Do not repeat the feature name in local identifiers:

```text
Bad:  WF-R1, AUTH-S2, STORAGE-A3
Good: R1, S2, A3
```

Within the same feature directory, reference the local ID directly. When referencing another feature, qualify the ID with the complete target feature directory basename:

```text
000-foundation/R1
001-agent-registry/S3
003-record-storage/T2
```

Use the complete basename, not only its numeric prefix.

Identifier stability rules:

* local IDs must be unique within their artifact type and feature directory
* removed IDs must not be reused for unrelated behavior; gaps are allowed
* once referenced by another feature, the directory basename is a stable namespace
* renaming or moving an externally referenced feature requires updating every qualified reference

Target trace within one feature:

```text
R1
 ↓
S1
 ↓
D1
 ↓
T1
 ↓
code
 ↓
A1 verification
```

Cross-feature trace example:

```text
000-foundation/S3
        ↓
002-subagent-runtime/D1
        ↓
002-subagent-runtime/T2
        ↓
002-subagent-runtime/A1
```

Not every artifact needs a one-to-one mapping, but meaningful requirements must remain traceable through implementation and verification.

A task should identify the specification or acceptance criteria it satisfies.

Example:

```markdown
## T3. Persist successful login sessions

Satisfies:
- R3
- S2
- A4

Depends on:
- T2
- 000-foundation/T2
```

Traceability exists to detect:

* missing implementation
* orphan tasks
* unsupported design decisions
* unverified requirements
* accidental scope expansion

---

# 6. Implementation

Implement according to:

1. constitution
2. requirements
3. specification
4. design
5. tasks

During implementation:

* stay within declared scope
* preserve unspecified existing behavior
* follow repository conventions
* avoid unrelated refactors
* update tests with behavior changes
* maintain compatibility requirements
* keep implementation proportional to the task
* update task progress as work proceeds

Example:

```markdown
## T2. Session persistence

- [x] Add session storage interface.
- [x] Add persistence implementation.
- [ ] Connect session creation.
```

`tasks.md` is mutable execution state and should remain current.

Do not mark tasks complete based solely on code being written.

---

# 7. Specification Conflicts

If implementation reveals that the specification or design is incomplete, incorrect, or impossible:

```text
implementation conflict
        ↓
re-evaluate requirement
        ↓
update spec
        ↓
update design
        ↓
update tasks
        ↓
continue implementation
```

Do not silently diverge from the specification.

Do not modify the specification after implementation merely to make accidental behavior appear intentional.

Changes must reflect actual intent.

---

# 8. Verification

Store verification evidence in:

```text
.specs/<feature>/verification.md
```

This file is optional during initial planning but should be created for non-trivial completed work.

Verification establishes that the implementation conforms to the specification.

Use applicable checks:

* unit tests
* integration tests
* end-to-end tests
* type checking
* linting
* static analysis
* build checks
* migration validation
* manual behavioral verification

## Format

````markdown
# Verification

## Acceptance Criteria

| Criterion | Verification | Result |
|---|---|---|
| A1 | `TestLoginSuccess` | PASS |
| A2 | `TestLoginInvalidPassword` | PASS |
| A3 | `TestLoginUnknownUser` | PASS |
| A4 | `TestLoginCreatesSession` | PASS |

## Commands

```bash
go test ./...
golangci-lint run
````

## Unverified

None.

````

Map verification back to acceptance criteria whenever practical.

Successful compilation alone does not prove behavioral correctness.

If verification cannot be executed, state explicitly:

- what was not verified
- why
- what evidence is still required

---

# 9. Review

Review completed work against the specification, not only against code quality.

Check:

- every requirement is addressed
- every relevant specification item is implemented
- every acceptance criterion is verified
- implementation matches documented interfaces
- no requirement was silently weakened
- no unintended scope was introduced
- important edge and failure cases are covered
- design remains consistent with the implementation
- unnecessary complexity was not introduced
- documentation still describes actual behavior

Review trace:

```text
Requirement
    ↓
Specification
    ↓
Design
    ↓
Task
    ↓
Implementation
    ↓
Verification
````

Resolve meaningful broken links before considering the feature complete.

---

# Artifact Mutation Rules

Artifacts have different expected stability.

```text
constitution.md     very stable
requirements.md     stable
spec.md             stable
design.md           moderately mutable
tasks.md            actively mutable
verification.md     actively mutable during validation
```

Use these rules:

## Constitution

Change only when repository-wide principles intentionally change.

## Requirements

Change when intent or scope changes.

Do not modify requirements merely because implementation is inconvenient.

## Specification

Change when intended externally observable behavior changes.

Treat changes as meaningful contract changes.

## Design

May evolve as implementation reveals better technical approaches, provided the specification remains satisfied.

## Tasks

Update continuously during implementation.

This is the primary shared mutable execution state.

## Verification

Update as tests and checks are executed.

It records evidence rather than intent.

---

# Scope Control

Separate required work from optional improvements.

Required:

```text
necessary to satisfy the specification
```

Optional:

```text
potential improvement not required by the specification
```

Do not automatically implement optional work.

Examples of potential scope expansion:

* unrelated refactor
* new abstraction not required by the spec
* additional feature
* speculative optimization
* dependency migration unrelated to the task
* cleanup outside the affected area

Record useful follow-up ideas separately.

---

# Lightweight Mode

For small, well-defined changes, a complete feature directory is not always necessary.

Use:

```text
.specs/<feature>/
├── spec.md
└── verification.md
```

or a lightweight specification:

```markdown
# Specification

## Expected Behavior

- ...

## Must Preserve

- ...

## Acceptance Criteria

- A1: ...
```

Then:

```text
SPEC
 ↓
IMPLEMENT
 ↓
VERIFY
```

Use lightweight mode when:

* behavior is obvious
* architecture does not change
* there are few edge cases
* implementation is localized
* no migration is required
* compatibility implications are minimal

---

# Full Mode

Use the full artifact set when the task involves one or more of:

* new feature
* ambiguous requirements
* public API change
* persistent data change
* architecture change
* multiple components
* migration
* compatibility concerns
* security-sensitive behavior
* complex state transitions
* multiple implementation phases
* multiple agents working on the same feature

Full mode:

```text
requirements.md
spec.md
design.md
tasks.md
verification.md
```

---

# Multi-Agent Usage

When multiple agents are involved, use the artifacts as explicit coordination boundaries.

## Planner / Architect

Primarily reads and updates:

```text
requirements.md
spec.md
design.md
tasks.md
```

## Developer

Primarily reads:

```text
constitution.md
spec.md
design.md
tasks.md
```

Primarily updates:

```text
tasks.md
code
tests
```

A developer should not casually modify requirements or specification to accommodate implementation.

## Reviewer

Primarily reads:

```text
requirements.md
spec.md
design.md
verification.md
implementation diff
```

Review behavior against the specification rather than relying on the implementation's own assumptions.

## Verifier / Test Agent

Primarily reads:

```text
spec.md
tasks.md
```

Primarily updates:

```text
verification.md
tests
```

`tasks.md` may serve as shared mutable state between agents.

`requirements.md` and `spec.md` should be treated as comparatively stable coordination contracts.

---

# README

Use `.specs/README.md` to document the repository's SDD convention.

Example:

```markdown
# Specifications

Each non-trivial feature lives in:

`.specs/<id>-<feature-name>/`

Artifacts:

- `requirements.md` — intent and requirements
- `spec.md` — observable behavior
- `design.md` — implementation design
- `tasks.md` — implementation plan and progress
- `verification.md` — acceptance evidence

Workflow:

requirements
→ spec
→ design
→ tasks
→ implementation
→ verification
```

Do not duplicate detailed workflow instructions here if they already exist in this skill.

---

# Completion Criteria

A feature is complete when:

* intended behavior is explicitly specified
* implementation conforms to the specification
* required tasks are complete
* acceptance criteria are verified
* unresolved verification gaps are documented
* meaningful behavior changes are reflected in the specification
* all local and cross-feature references resolve to existing identifiers
* implementation has not introduced undeclared scope

Do not consider work complete solely because implementation code exists.

---

# Core Principle

```text
Intent defines requirements.
Requirements define behavior.
Specification defines the contract.
Design defines the implementation approach.
Tasks define execution.
Implementation realizes the design.
Verification proves conformance.
```

When code and specification disagree, resolve the disagreement explicitly.

Do not assume the code is correct merely because it exists.

