---
description: Commit and push nvim/pi changes, update Nix flakes, then run nis
---
Perform these steps in order. Do not treat this template as authorization to bypass Git, credential, or destructive-action safeguards. Stop and report the blocker if a step cannot safely complete; do not continue to later steps after a failure.

1. In each of `~/.config/nvim` and `~/.config/pi`, independently inspect Git status (including untracked paths), current branch, upstream, and push destination. **Before staging anything**, check changed and untracked file names for credential files, private keys, token stores, and other sensitive material. Do not open or inspect the contents of suspected credential files, even to verify them. Inspect diffs only for files that are safe to inspect; if sensitive material is suspected or encountered, do not stage it, disclose it, or proceed with an ambiguous set of changes—report the blocker and ask how to scope the commit. Stage only the intended safe changes, then verify the staged file list and staged diff before committing. Create a separate descriptive commit in each repository that has changes to commit; do not create empty commits. Push each repository's commits only to the explicitly approved remote and branch. If the destination has not been explicitly approved, ask before pushing. Do not force-push, discard changes, or bypass hooks. Confirm both repositories are successfully handled before proceeding.
2. In `~/nixconf`, run exactly `nix flake update pi-xvzc nvim-xvzc`. Preserve any existing changes; if the command fails, stop and report the failure. Do not commit or push `~/nixconf` unless separately authorized.
3. After the update succeeds, run exactly `zsh -ic 'nis'`. If it fails, stop and report the failure.

Report the commits and push destinations, the flake update result, the `nis` result, and any remaining uncommitted changes. Do not claim success for a step that did not complete.
