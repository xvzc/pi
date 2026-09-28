---
description: Commit and push nvim/pi changes, update Nix flakes, then run nis
---

# Sync flakes

## Authorization and stop conditions

Invoking this prompt assigns the task of completing the steps below in order and grants one-time approval **for this execution only** to:

- Push safe, intended changes from `~/.config/nvim` and `~/.config/pi` to each repository's `origin/main`.
- Run the `sudo darwin-rebuild switch` operation contained in step 4's `zsh -ic 'nis'`.

This is not standing authorization for future invocations or unrelated elevated operations. It does not authorize bypassing Git, credential, or destructive-action safeguards. Perform the steps below **in order**. If a step cannot safely complete, stop and report the blocker; do not continue to later steps.

For **each** repository in steps 1 and 2, independently inspect Git status (including untracked paths), current branch, upstream, and push destination. **Before staging anything**, check changed and untracked file names for credential files, private keys, token stores, and other sensitive material. Do not open or inspect the contents of suspected credential files, even to verify them. Inspect diffs only for files that are safe to inspect. If sensitive material is suspected or encountered, do not stage it, disclose it, or proceed with an ambiguous set of changes; report the blocker and ask how to scope the commit.

In each repository, stage only the intended safe changes, then verify the staged file list and staged diff before committing. Create a separate descriptive commit if it has changes to commit; do not create an empty commit. Push commits **only** to `origin/main`, the destination covered by the one-time approval above. If the push destination is anything else, ask before pushing. Do not force-push, discard changes, or bypass hooks. Confirm **both** repositories are successfully handled before proceeding to step 3.

## 1. nvim (`~/.config/nvim`)

Apply the repository inspection, staging, commit, and push safeguards above to `~/.config/nvim`.

## 2. pi (`~/.config/pi`)

Apply the repository inspection, staging, commit, and push safeguards above to `~/.config/pi`. Before staging, check that the following self-managed extensions in `settings.json`'s `packages` list use their `npm:` specifiers rather than local paths:

- `npm:@xvzc/pi-subagents-minimal`
- `npm:@xvzc/pi-tasks`

If either entry uses a local path, change only that entry to its listed `npm:` specifier before committing and pushing. Preserve unrelated package entries and settings; if an entry cannot be identified unambiguously, stop and ask.

## 3. Update Nix flakes

run exactly:

```sh
nix flake update pi-xvzc nvim-xvzc --flake ~/nixconf
```

A pre-existing dirty `flake.lock` (uncommitted changes) is expected and is not a reason to stop or ask; this command may replace the prior pin values of the selected inputs. Do not discard or revert unrelated existing changes. If the command fails, stop and report the failure. Do not commit or push `~/nixconf` unless separately authorized.

## 4. Run nis

After the update succeeds, run exactly:

```sh
zsh -ic 'nis'
```

If it fails, stop and report the failure.

## Report

Report the commits and push destinations, the flake update result, the `nis` result, and any remaining uncommitted changes. Do not claim success for a step that did not complete.
