# Specification

This reference governs drafting or revising a spec-driven development specification. It does not authorize implementation.

## 1. Establish product intent

From the user's natural-language request and bounded project inspection, identify:

- Problem or opportunity.
- Target users or actors.
- Desired outcomes and user value.
- In-scope behavior.
- Explicit non-goals.
- Constraints already given by the user or project.

Prefer existing project terminology. Do not invent product commitments that are not implied by the request.

## 2. Draft testable requirements

Write requirements as observable behavior, not implementation instructions. Use stable IDs when useful.

Recommended sections:

```markdown
# Feature Specification: <name>

## Overview
<what and why>

## User Stories
- As a <user>, I want <capability>, so that <outcome>.

## Functional Requirements
- FR-001: The system MUST ...

## Acceptance Criteria
- AC-001: Given ..., when ..., then ...

## Edge Cases
- ...

## Non-Goals
- ...

## Assumptions
- ...

## Open Questions
- ...
```

## 3. Separate what from how

The specification may mention required integrations, compatibility rules, performance goals, security constraints, or mandated technologies when the user or existing system requires them. Otherwise leave technical architecture, file choices, libraries, and task breakdown for planning.

## 4. Define done

A spec is ready for planning only when:

- Every in-scope behavior has at least one acceptance criterion or equivalent check.
- Non-goals and assumptions are explicit.
- Blocking product/API/data/security ambiguities are resolved or queued for the user.
- The remaining choices are routine implementation decisions suitable for planning.
