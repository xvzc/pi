import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { getAgentDir, keyText } from "@earendil-works/pi-coding-agent";
import { Box } from "@earendil-works/pi-tui";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@earendil-works/pi-coding-agent", () => ({
	getAgentDir: vi.fn(() => "/no-skills"),
	keyText: vi.fn(() => "ctrl+o"),
}));

import registerSkillLoader from "./index.js";

const directories: string[] = [];

afterEach(async () => {
	await Promise.all(directories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })));
});

it("replaces Pi core's read skill-loading instruction", async () => {
	let handler: ((event: { systemPrompt: string }) => Promise<{ systemPrompt: string }>) | undefined;
	registerSkillLoader({
		on: (event: string, callback: typeof handler) => {
			if (event === "before_agent_start") handler = callback;
		},
		registerTool: () => {},
	} as any);

	const coreInstruction = "Use the read tool to load a skill's file when the task matches its description.";
	const result = await handler?.({ systemPrompt: `Base instructions\n${coreInstruction}` });

	expect(result?.systemPrompt).toContain("Base instructions");
	expect(result?.systemPrompt).not.toContain(coreInstruction);
	expect(result?.systemPrompt).toContain("use `load_skill` with the skill's absolute `SKILL.md` path");
	expect(result?.systemPrompt).toContain("treat that skill as already active");
	expect(result?.systemPrompt).toContain("Treat a skill-relative reference requested by an active skill as part of that skill");
});

it("replaces Pi core's bash skill-loading instruction and preserves unrelated prompts", async () => {
	let handler: ((event: { systemPrompt: string }) => Promise<{ systemPrompt: string }>) | undefined;
	registerSkillLoader({
		on: (event: string, callback: typeof handler) => {
			if (event === "before_agent_start") handler = callback;
		},
		registerTool: () => {},
	} as any);

	const coreInstruction = "Use bash to load a skill's file when the task matches its description.";
	const replaced = await handler?.({ systemPrompt: coreInstruction });
	const unchanged = await handler?.({ systemPrompt: "Custom system prompt" });

	expect(replaced?.systemPrompt).not.toContain(coreInstruction);
	expect(replaced?.systemPrompt).toContain("use `load_skill` with the skill's absolute `SKILL.md` path");
	expect(unchanged?.systemPrompt).toBe("Custom system prompt");
});

it("registers aliases that inject the canonical skill content", async () => {
	let discover: ((event: { cwd: string; reason: "startup" | "reload" }) => Promise<void>) | undefined;
	const commands = new Map<string, any>();
	const messages: Array<{ content: string; options: unknown }> = [];
	const directory = await mkdtemp(join(tmpdir(), "pi-better-skills-"));
	directories.push(directory);
	await mkdir(join(directory, "skills", "plan-driven-development"), { recursive: true });
	const path = join(directory, "skills", "plan-driven-development", "SKILL.md");
	await writeFile(path, "---\nname: plan-driven-development\naliases: [pdd]\n---\n# Plan");
	vi.mocked(getAgentDir).mockReturnValue(directory);

	registerSkillLoader({
		on: (event: string, callback: typeof discover) => {
			if (event === "resources_discover") discover = callback;
		},
		getCommands: () => [],
		registerCommand: (name: string, command: unknown) => commands.set(name, command),
		registerTool: () => {},
		sendUserMessage: (content: string, options: unknown) => messages.push({ content, options }),
	} as any);

	await discover?.({ cwd: directory, reason: "startup" });
	expect(commands.get("skill:pdd")?.description).toBe("Activate plan-driven-development");
	await commands.get("skill:pdd").handler("make a plan");
	const resolvedPath = await realpath(path);

	expect(messages).toEqual([{
		content: `<skill name="plan-driven-development" location="${resolvedPath}">\nReferences are relative to ${dirname(resolvedPath)}.\n\n# Plan\n</skill>\n\nmake a plan`,
		options: { expandPromptTemplates: false },
	}]);
});

it("returns the built-in skill invocation format without a UI notification", async () => {
	let tool: any;
	registerSkillLoader({ on: () => {}, registerTool: (definition: unknown) => (tool = definition) } as any);

	const directory = await mkdtemp(join(tmpdir(), "pi-better-skills-"));
	directories.push(directory);
	const path = join(directory, "SKILL.md");
	await writeFile(path, "---\nname: example-skill\n---\n# Example");

	const notifications: string[] = [];
	const result = await tool.execute("call", { path }, new AbortController().signal, () => {}, {
		hasUI: true,
		ui: { notify: (message: string) => notifications.push(message) },
	});

	expect(tool.name).toBe("load_skill");
	expect(notifications).toEqual([]);
	const theme = { fg: (_color: string, text: string) => text, bg: (_color: string, text: string) => text, bold: (text: string) => text };
	expect(tool.renderCall({}, theme, { toolCallId: "call" }).render(80).join("\n")).toContain("[skill] example-skill");
	const resolvedPath = result.details.path;
	expect(result.content[0].text).toBe(
		`<skill name="example-skill" location="${resolvedPath}">\nReferences are relative to ${dirname(resolvedPath)}.\n\n# Example\n</skill>`,
	);
});

it("renders a skill-relative label for loaded references", async () => {
	let tool: any;
	registerSkillLoader({ on: () => {}, registerTool: (definition: unknown) => (tool = definition) } as any);

	const directory = await mkdtemp(join(tmpdir(), "pi-better-skills-"));
	directories.push(directory);
	await writeFile(join(directory, "SKILL.md"), "---\nname: example-skill\n---\n# Example");
	await mkdir(join(directory, "references"));
	const path = join(directory, "references", "planning.md");
	await writeFile(path, "# Planning");
	await tool.execute("call", { path }, new AbortController().signal, () => {}, {});

	const theme = { fg: (_color: string, text: string) => text, bg: (_color: string, text: string) => text, bold: (text: string) => text };
	const card = tool.renderCall({}, theme, { toolCallId: "call" });
	expect(card.render(80).join("\n")).toContain("[skill] example-skill/references/planning.md");
});

it("animates a spinner while the skill name is loading", async () => {
	vi.useFakeTimers();
	try {
		let tool: any;
		registerSkillLoader({ on: () => {}, registerTool: (definition: unknown) => (tool = definition) } as any);

		const calls: string[] = [];
		const theme = {
			fg: (color: string, text: string) => {
				calls.push(`fg:${color}`);
				return text;
			},
			bg: (color: string, text: string) => {
				calls.push(`bg:${color}`);
				return text;
			},
			bold: (text: string) => text,
		};
		const invalidate = vi.fn();
		vi.mocked(keyText).mockReturnValueOnce("ctrl+shift+o");
		const card = tool.renderCall({}, theme, { toolCallId: "call", invalidate });

		expect(card).toBeInstanceOf(Box);
		expect(card.render(80).join("\n")).toContain("⣾");
		expect(card.render(80).join("\n")).not.toContain("loading");
		expect(card.render(80).join("\n")).toContain("(ctrl+shift+o to expand)");
		vi.advanceTimersByTime(80);
		expect(invalidate).toHaveBeenCalledOnce();
		expect(calls).toEqual(expect.arrayContaining(["fg:customMessageLabel", "fg:customMessageText", "fg:dim"]));
		expect(calls).toContain("bg:customMessageBg");

		const directory = await mkdtemp(join(tmpdir(), "pi-better-skills-"));
		directories.push(directory);
		const path = join(directory, "SKILL.md");
		await writeFile(path, "---\nname: example-skill\n---\n# Example");
		await tool.execute("call", { path }, new AbortController().signal, () => {}, {});
		expect(vi.getTimerCount()).toBe(0);
	} finally {
		vi.useRealTimers();
	}
});
