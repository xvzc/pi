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

## CI Monitoring

For CI monitoring, follow `references/ci.md`.

## Report

Report the pull request URL, source and base branches, and included commit range.
