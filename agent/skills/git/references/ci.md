# CI Monitoring

## Start Monitoring

After an authorized push triggers configured CI, start monitoring as a background
task. Do not block the main interaction while waiting for completion.

Report that monitoring has started. When the background task completes, report the
final result.

## Provider Tooling

Use the CI provider's available tooling. For GitHub-hosted repositories with
GitHub CLI access, for example:

```bash
gh run list --branch <branch> --limit 1
gh run watch <run-id> --exit-status
```

Confirm that the selected run belongs to the relevant push before monitoring it.

## Results

- Report the workflow's final status and URL when available.
- For failures, summarize the failing job and relevant error output.
- If CI cannot be inspected from the environment, report that limitation.
- Do not claim a workflow passed until its final status is confirmed.

## Downstream Actions

When a later action—such as merging or deployment—requires CI success, verify the
completed result before performing that action.
