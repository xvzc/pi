---
name: git
description: >-
  Use when performing one of the following Git-related operations:
   [commit, push, pull_request, worktree, ci].
---

# Git Operations

## Commits

Load `references/commit.md` only when the user has explicitly authorized creating
a Git commit. Follow its guidance together with applicable system safety rules.

## Pushes

Load `references/push.md` only when the user has explicitly authorized pushing to
a remote repository. Follow its guidance together with applicable system safety rules.

## Pull Requests

Load `references/pull_request.md` only when the user has explicitly authorized
creating a pull request. Follow its guidance together with applicable system safety rules.

## CI

Load `references/ci.md` when monitoring CI triggered by a Git-related operation.
Follow its guidance together with applicable system safety rules.

## Worktrees

Load `references/worktrees.md` immediately before starting feature work that needs
an isolated workspace, or before executing an implementation plan. Follow its
guidance together with applicable system safety rules.

## Git Safety Protocol

- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
