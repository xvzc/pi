# Execution

This reference governs the execution stage. Carry out the active plan; do not
independently decide what work to perform, who owns it, task pairings,
dependencies, execution arrangements, or integration and validation scope.

Planning and execution are stages, not separate agents. Decisions about what
will be executed belong to the planning stage.

## Materializing the plan

When execution is authorized, use task-management to materialize the complete
plan, including owners and real dependencies, before execution begins. Represent
independently owned asynchronous deliverables as separate tasks, not every command.

Do not implement or dispatch planned execution work during this bookkeeping.

## Executing the plan

Read the active plan and execute its tasks with the specified owners,
dependencies, synchronous/asynchronous arrangements, and workspaces.
Start work only when its required approvals and dependencies are satisfied.

Follow task-management for task state and bookkeeping. Follow agent-coordination
for subagent dispatch, result collection, and follow-up execution. Load relevant
execution procedures when their planned action is about to run.

Perform integration and validation as tasks already defined by the plan, using
their assigned owners and checks. Do not add separate integration, review, or
validation work during execution.

## Following outcome-dependent task relationships

When the plan makes progress conditional on a dependent task's evaluation of
another task's output, use that outcome to follow the planned continuation or
correction path.

If the outcome requires in-scope changes to a prerequisite output, re-execute
the responsible existing task, then the dependent tasks whose results must be
renewed for the changed output. Do not advance work whose required conditions
remain unsatisfied or reuse results invalidated by the change.

Keep this feedback within the affected dependency chain. Unrelated work may
continue according to the plan without waiting for that chain to settle.
An unexpected outcome handled by the planned feedback path does not itself
require a new task or replanning. Follow the plan's stop conditions and use
task-management and agent-coordination for operational details.

## Handling required plan changes

If the plan cannot be executed and no authorized fallback applies, or if the
required work exceeds the planned scope or structure, pause the affected work
and return to the planning stage to revise that part of the plan.

Continue unaffected planned work when safe. Do not silently substitute a new
assignment, execution arrangement, or acceptance criterion.

## Reporting results

Report the results of the planned work, actual validation evidence, unresolved
issues, and any work or checks that could not be performed.

Distinguish reported success from verified results. Do not claim completion
without evidence that the planned deliverables and acceptance checks are met.
