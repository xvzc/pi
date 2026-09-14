# Clarification

This reference governs whether to ask the user questions or proceed using documented assumptions.

## 1. Classify ambiguity

Ask the user only when ambiguity affects one of these:

- User-visible product behavior or UX contract.
- Public API, schema, or compatibility policy.
- Data model, persistence, migrations, or deletion semantics.
- Security, privacy, permissions, compliance, or production data.
- Cost, external services, releases, or irreversible operations.
- Scope tradeoffs where multiple reasonable interpretations produce materially different work.

Do not ask about routine, reversible implementation choices that can follow project conventions.

## 2. Ask minimally

When questions are needed:

- Ask the fewest questions that unblock the spec.
- Offer 2-4 concrete options when possible, with a recommended default first.
- Explain the impact of each option briefly.
- Do not bundle unrelated decisions into one unclear question.

## 3. Proceed with assumptions

When no blocking ambiguity exists, proceed and record assumptions in the spec. Good assumptions are:

- Explicit.
- Low-risk.
- Reversible.
- Consistent with existing project behavior.
- Easy to validate or change later.

## 4. Stop conditions

Pause instead of planning or implementing when unresolved ambiguity could cause unsafe data changes, incompatible public behavior, or wasted work on a likely-wrong product direction.
