AGENT_SOURCE := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))agent)
AGENT_ITEMS := $(filter-out npm .pi,$(notdir $(wildcard $(AGENT_SOURCE)/* $(AGENT_SOURCE)/.[!.]* $(AGENT_SOURCE)/..?*)))
AGENT_DEST := $(HOME)/.pi/agent

.PHONY: init
init:
	@set -eu; \
	src='$(AGENT_SOURCE)'; dest='$(AGENT_DEST)'; \
	if [ -L "$$dest" ]; then echo "Refusing symlinked directory: $$dest" >&2; exit 1; fi; \
	if [ -e "$$dest" ] && [ ! -d "$$dest" ]; then echo "Not a directory: $$dest" >&2; exit 1; fi; \
	for item in $(AGENT_ITEMS); do \
		if [ ! -e "$$src/$$item" ]; then echo "Missing source: $$src/$$item" >&2; exit 1; fi; \
	done; \
	mkdir -p "$$dest"; \
	for item in $(AGENT_ITEMS); do \
		if [ -L "$$dest/$$item" ] && [ "$$(readlink "$$dest/$$item")" = "$$src/$$item" ]; then \
			continue; \
		fi; \
		if [ -e "$$dest/$$item" ] || [ -L "$$dest/$$item" ]; then \
			if [ -L "$$dest/backups" ]; then echo "Refusing symlinked backup directory: $$dest/backups" >&2; exit 1; fi; \
			if [ -e "$$dest/backups" ] && [ ! -d "$$dest/backups" ]; then echo "Not a directory: $$dest/backups" >&2; exit 1; fi; \
			mkdir -p "$$dest/backups"; \
			n=1; \
			while [ -e "$$dest/backups/$$item.before-init.$$n" ] || [ -L "$$dest/backups/$$item.before-init.$$n" ]; do n=$$((n + 1)); done; \
			mv "$$dest/$$item" "$$dest/backups/$$item.before-init.$$n"; \
			echo "Preserved previous item: $$dest/backups/$$item.before-init.$$n"; \
		fi; \
		ln -s "$$src/$$item" "$$dest/$$item"; \
	done
