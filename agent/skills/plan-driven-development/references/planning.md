# Planning

The need for planning is already established. This stage determines what will
run, who will perform it, and how tasks relate, so execution does not decide the
work's scope or structure again. Planning and execution are stages, not agents.

## Establishing the deliverable

Identify the outcome, scope, constraints, non-goals, acceptance criteria, and
user-owned decisions. Inspect enough context to resolve task boundaries and
execution requirements; ask about unresolved user-owned decisions rather than
assuming their answers.

## Deciding the execution shape

Assign work to the main agent or appropriate subagent roles. Decompose large work
where task boundaries are clear, not merely to increase parallelism.

Choose execution arrangements for each task:

- Asynchronous when other authorized work can proceed safely while it runs.
- Synchronous when the next action requires its result and nothing else useful
  can proceed.
- Concurrent only when dependencies and workspace access permit it.

For delegated writers, default to isolated workspaces. Respect explicit workspace
constraints; if isolation is unavailable, plan serialized writes instead.
Pair each delegated writer task with one reviewer task and its own implementation,
review, correction, and re-review loop. Independent pairs must not wait for
unrelated pairs.

Identify actual dependencies, not preferred ordering: review requires reviewable
output; integration requires its input outputs and their required acceptance checks.

## Writing the plan

Record the decisions above in a concise, executable plan:

- Objective, scope, constraints, and non-goals.
- Each task's owner, planned work, authority, output, and acceptance criteria.
- Dependencies, synchronous/asynchronous arrangements, and task pairings.
- Feedback paths, workspace isolation, artifact handoff, and authorized fallbacks.
- Validation commands or observable checks, their scope, and their owners.
- Approvals, stop conditions, and known blockers.

When outputs must be combined, include explicit main-agent-owned integration and
integrated testing tasks. Specify inputs, dependencies, integration scope,
conflict or contract-mismatch handling, and combined-result checks. Individual
task checks do not replace integrated tests.

Preserve paths, commands, identifiers, and quoted source text.

## Revising the plan

Revise only the affected part when evidence requires changes to the deliverable,
assigned work, ownership, dependencies, execution arrangement, or acceptance
criteria. Preserve unaffected work and progress; obtain approval for consequential
user-owned decisions.

Plan feedback paths, not speculative findings or correction tasks. Unexpected
in-scope defects handled by those paths use existing tasks without replanning.
