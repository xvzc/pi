# Pull Request

## Authorization

Creating a pull request is an external collaboration action. Create one only after
the user explicitly authorizes the target repository and base branch.

## Preflight

```bash
git status --short
git branch --show-current
git log --oneline <base-branch>..HEAD
git diff --stat <base-branch>...HEAD
```

Confirm the source branch, base branch, included commits, and checks. If the branch
has not been pushed, obtain separate authorization before pushing it.

## Create

Use the repository host's available tooling, for example:

```bash
# For GitHub-hosted repositories with GitHub CLI access
gh pr create --base <base-branch> --head <branch> --title "<title>" --body "<body>"
```

Write a concise title and description that cover the change, validation performed,
and known limitations. Do not claim tests passed without confirmation.

## Merge

Merge only when the user explicitly authorizes merging the specific pull request
into its target base branch. Creating a pull request does not authorize merging it.

Before merging, confirm the pull request's source and base branches, current head
commit, required reviews, and check results. Respect branch protections and do
not bypass failing or pending required checks.

For an automatically generated PR whose changes only create a release, approving
a pending workflow run is not required before merging, provided the repository
allows the merge without it. Do not approve the workflow run merely to merge;
if its check is required or branch protection blocks the merge, stop rather than
bypassing it. This exception does not waive authorization to merge the specific PR.

Default to rebase merging unless the user explicitly requests another method;
confirm that it is allowed by the repository.

After a successful merge, delete the remote PR source branch if it is unprotected,
unless the user requests keeping it. Never delete the local branch as part of this
workflow. Confirm the source repository, branch, and protection status before
deletion; if protection or ownership is uncertain, leave it intact and report why.

For GitHub-hosted repositories with GitHub CLI access, for example:

```bash
# Inspect the intended PR, branches, head commit, review decision, and merge state
gh pr view <number> --json number,headRefName,baseRefName,headRefOid,reviewDecision,mergeStateStatus
# Confirm required checks and their results
gh pr checks <number>
# Default: only after explicit authorization to merge this PR
gh pr merge <number> --rebase
# Verify the merged state and resulting commit
gh pr view <number> --json state,mergedAt,mergeCommit
# Only after verifying the merge and the source repo/branch: check protection
gh api 'repos/<source-owner>/<source-repo>/branches/<source-branch>' --jq '.protected'
# If explicitly unprotected, delete only the remote source branch
gh api --method DELETE 'repos/<source-owner>/<source-repo>/git/refs/heads/<source-branch>'
# Confirm the remote source branch no longer exists
gh api 'repos/<source-owner>/<source-repo>/branches/<source-branch>'
```

The final branch lookup should return not found after deletion; if it does not,
report the cleanup as incomplete. Do not use `gh pr merge --delete-branch` here:
it can also delete the local branch. Use `--merge` or `--squash` instead of
`--rebase` only when the user explicitly requests that method. After merging,
verify and report the resulting merge status and commit; do not claim success if
verification fails.

## CI Monitoring

For CI monitoring, follow `references/ci.md`.

## Report

Report the pull request URL, source and base branches, and included commit range.
