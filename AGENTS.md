# Repository instructions

When adding a new tracked top-level file or directory under `agent/`, update the `AGENT_ITEMS` whitelist in the root `Makefile` so `make init` links it into `~/.pi/agent/`. Files inside an already-listed directory are covered by that directory's link and need no additional entry. Never add credentials, secrets, or machine-local runtime state to the whitelist.
