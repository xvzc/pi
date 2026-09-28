# Git Push

## Authorization

Pushing changes affects a remote repository. Push only after the user explicitly
approves the target remote and branch. Unless the user explicitly requests
another destination, push to a separate topic branch, not `main` or `master`.
Push to `main` or `master` only when the user explicitly requests and approves
that destination.

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
# Default: push the topic branch to the approved remote
git push --set-upstream origin <topic-branch>

# Only when the user explicitly requests and approves a direct push to origin/main
git push origin HEAD:main
```

## CI Monitoring

For CI monitoring after a successful push, follow `references/ci.md`.

## Report

State the remote, branch, pushed commit range, and the resulting remote URL if
available.

## Safety

- If the push is rejected, report the remote state and ask before rebasing,
  merging, or force-pushing.

