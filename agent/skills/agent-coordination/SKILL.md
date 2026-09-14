---
name: agent-coordination
description: Load only immediately before an actual subagent dispatch via `Agent` or `TaskExecute`. Never load during planning, scoping, task creation, local implementation, validation, or merely because a future step may use a subagent. If the next tool call is not the subagent dispatch itself, do not load this skill.
---

# Agent Coordination

In a multi-part task that includes subagent-owned tasks, load this skill immediately
before executing the relevant subagent-owned task. Do not load it merely because
such a task may be executed later.

The lead owns decomposition, dispatch, follow-up, output relay, review loops,
acceptance, and integration. Children execute bounded tasks and return results or
questions; they do not create orchestration tasks or delegate work. This skill does
not authorize additional scope.

## 1. Check capabilities and dependencies

Use actual runtime tool descriptions as the API source of truth. Do not duplicate
schemas here or invent a tool/type because a third-party template mentions it.

The current role conventions are:

| Role       | Intended assignment                               |
| ---        | ---                                               |
| scout      | Fast read-only discovery and evidence gathering   |
| architect  | Read-only design and tradeoff analysis            |
| engineer   | Approved source/test changes and objective checks |
| documenter | Approved documentation and example changes        |
| reviewer   | Independent read-only critique                    |

Confirm the role is available and its tools permit the requested work. A read-only
role with bash is still read-only; do not assign installs, service starts, generators,
or tests that write state to it. Have the lead or an authorized writer perform them.

Review hard task dependencies before dispatch. Stabilize shared APIs, schemas, and
other contracts before dependent modules proceed. Run independent tasks concurrently
only when safe and useful; separate output directories alone do not isolate writers.
Honor direct-only requests rather than treating complexity as permission to delegate.

Ordinary `Agent` delegation and `SubagentWorkflow` are different choices. Use the
latter only when its explicit orchestration opt-in requirements are satisfied.
Do not launch a workflow just because the work could benefit from one.

## 2. Prepare a bounded brief

Explain enough context for judgment without passing the entire parent conversation.
Include the relevant items below:

- Goal and why the subtask matters.
- Known facts, prior decisions, and exact files or input artifacts.
- Permitted scope, non-goals, read/write authority, and existing changes to preserve.
- Shared contracts and verified dependency outputs.
- Validation criteria and commands where known.
- Stop conditions and user-owned decisions the child must return to the lead.
- Output contract: status, findings/changed files, checks and evidence, limitations,
  questions, and branch/artifact details where relevant.

Use English for agent-to-agent communication, including subagent briefs,
follow-up steering, resumed-agent prompts, and internal handoffs, unless the task
requires another language. Keep secrets out of prompts. Label forwarded child
material with its source and purpose; distinguish verified facts from a child's
unverified claims. Supply the minimum useful excerpts or files.

Current role agents have `skills: false`. Do not assume they know skills loaded by
the lead. Pass relevant constraints and checks explicitly, not the full lead workflow
or workflow-specific procedure. Keep role restrictions in force. Use their existing status contract
(`done`, `question`, `blocked`) without imposing a contradictory second format.

## 3. Dispatch and collect

Use `Agent` to launch and `get_subagent_result` to collect completed background
results, following their current contracts. Launch independent parallel calls together
when parallel execution is intended. A todo entry is not a dispatch.

Background is the normal choice when useful local work remains. Work on other safe
steps and process completion notifications; do not sleep or poll for progress. Use
foreground execution only when the next action is gated by the result and nothing
else useful can proceed. Never fabricate a result before completion.

Do not select unknown models or raise model cost blindly. Use role defaults unless
an available override is justified by the task and permitted by the runtime.

For child questions and blockers:

1. Determine whether the lead can resolve them by bounded verification or an existing
   approved decision. Ask the user only for unresolved user-owned choices.
2. Preserve the child context where possible. Use `steer_subagent` for a running child;
   use `Agent` with `resume` for a completed retained child.
3. Resume only after the missing context, approval, or capability is available.
4. Start a fresh child only when needed, forwarding the relevant prior evidence.

On failures, report what actually ran, preserve useful artifacts, and decide whether
a scoped retry is justified. Do not repeatedly send the same unresolved assignment.

## 4. Isolate writers and integrate

At most one writer may be active in a workspace, including the lead. Read-only work
can overlap only if reading a changing workspace will not invalidate its conclusions;
for acceptance reviews, prefer a stable diff or snapshot.

For concurrent writers:

- Verify the tool can actually run the child in the selected workspace. Do not invent
  a cwd parameter or assume a prior shell `cd` changes later tool calls.
- Isolation must succeed before concurrent writing begins. If unavailable, serialize
  writers or report the blocker; never silently run them together in the main checkout.
- Follow the runtime's preservation/cleanup contract. Collect branch/base information
  and inspect actual changes before integration; do not assume output paths survive cleanup.

The lead reconciles outputs and checks conflicts, shared contracts, user changes,
and scope. Integrate only authorized changes and run combined validation after the
merge of work, not merely each child's isolated tests. Do not publish, merge to a
shared branch, or perform destructive cleanup without the appropriate authorization.

Apply the project’s validation and acceptance standards when deciding on review,
fixes, and final acceptance.
