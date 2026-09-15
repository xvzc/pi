# Git Push

## Authorization

Pushing changes affects a remote repository. Push only after the user explicitly
approves the target remote and branch.

## Preflight

```bash
git status --short
git branch --show-current
git log --oneline '@{upstream}..HEAD' 2>/dev/null || true
git remote -v
```

Confirm the commits and destination before pushing. Do not push unrelated local
changes, secrets, or generated artifacts.

## Push

```bash
# Existing upstream
git push

# First push for the current branch
git push --set-upstream origin <branch>
```

## Safety

- Never force-push without explicit approval.
- If the push is rejected, report the remote state and ask before rebasing,
  merging, or force-pushing.

## CI Monitoring

For CI monitoring after a successful push, follow `references/ci.md`.

## Report

State the remote, branch, pushed commit range, and the resulting remote URL if
available.
