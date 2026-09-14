import { getAgentDir, keyText, type ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Box, Text } from "@earendil-works/pi-tui";
import { Type } from "typebox";
import { resolve } from "node:path";

import { discoverSkills, formatSkillToolOutput, loadSkill } from "./skill.js";

const SPINNER_FRAMES = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];

class SkillLoadSpinner extends Text {
	private frame = 0;
	private timer: ReturnType<typeof setInterval> | undefined;

	constructor(
		private readonly requestRender: () => void,
		private readonly format: (frame: string) => string,
	) {
		super("", 0, 0);
		this.update();
	}

	start() {
		if (this.timer) return;
		this.timer = setInterval(() => {
			this.frame = (this.frame + 1) % SPINNER_FRAMES.length;
			this.update();
			this.requestRender();
		}, 80);
	}

	stop() {
		if (!this.timer) return;
		clearInterval(this.timer);
		this.timer = undefined;
	}

	private update() {
		this.setText(this.format(SPINNER_FRAMES[this.frame]));
	}
}

function expandHint(): string {
	const shortcut = keyText("app.tools.expand");
	return shortcut ? ` (${shortcut} to expand)` : "";
}

const LoadSkillParams = Type.Object({
	path: Type.String({ description: "Absolute path to a SKILL.md file or one of its contained reference files." }),
});

const CORE_SKILL_LOADING_INSTRUCTIONS = [
	"Use the read tool to load a skill's file when the task matches its description.",
	"Use bash to load a skill's file when the task matches its description.",
];

const LOAD_SKILL_INSTRUCTION = [
	"If the current user message already contains `<skill ...>...</skill>` for a matching skill, treat that skill as already active; do not call `load_skill` again for its `SKILL.md`.",
	"Treat a skill-relative reference requested by an active skill as part of that skill, and load it with `load_skill` immediately before the work it governs.",
	"For a matching skill not already injected, use `load_skill` with the skill's absolute `SKILL.md` path immediately before the work it governs.",
].join(" ");

function replaceCoreSkillLoadingInstructions(systemPrompt: string): string {
	return CORE_SKILL_LOADING_INSTRUCTIONS.reduce(
		(prompt, instruction) => prompt.replaceAll(instruction, LOAD_SKILL_INSTRUCTION),
		systemPrompt,
	);
}

export default function (pi: ExtensionAPI) {
	const loadedSkillNames = new Map<string, string>();
	const loadingSpinners = new Map<string, SkillLoadSpinner>();
	const registeredCommands = new Set<string>();

	pi.on("resources_discover", async (event) => {
		const roots = [
			resolve(getAgentDir(), "skills"),
			resolve(event.cwd, ".pi", "skills"),
			resolve(event.cwd, ".agents", "skills"),
		];
		const skills = await discoverSkills(roots);
		const claimedNames = new Set(pi.getCommands().map((command) => command.name));

		for (const skill of skills) {
			for (const alias of skill.aliases) {
				const commandName = `skill:${alias}`;
				if (registeredCommands.has(commandName) || claimedNames.has(commandName)) continue;

				pi.registerCommand(commandName, {
					description: `Activate ${skill.name}`,
					handler: async (args) => {
						const loaded = await loadSkill(skill.path);
						if (!loaded.isActivation) throw new Error(`Skill alias must target SKILL.md: ${skill.path}`);
						const invocation = args.trim();
						const content = formatSkillToolOutput(loaded);
						pi.sendUserMessage(invocation ? `${content}\n\n${invocation}` : content, {
							expandPromptTemplates: false,
						});
					},
				});
				registeredCommands.add(commandName);
				claimedNames.add(commandName);
			}
		}
	});

	pi.on("before_agent_start", async (event) => ({
		systemPrompt: replaceCoreSkillLoadingInstructions(event.systemPrompt),
	}));

	pi.registerTool({
		name: "load_skill",
		label: "Load skill",
		description:
			"Load a SKILL.md file to activate its skill, or load a file contained by a skill directory when that skill instructs you to load a reference. Use read when only maintaining, reviewing, or informally referencing skill files.",
		promptSnippet: "Activate task-specific skills or load references required by active skills.",
		promptGuidelines: [
			"Use `load_skill` immediately before the work governed by a matching skill; do not preload skills for possible future work.",
			"Do not reload a skill already injected as `<skill ...>...</skill>` in the current user message.",
		],
		parameters: LoadSkillParams,
		renderShell: "self",
		renderCall: (_params, theme, context) => {
			const name = loadedSkillNames.get(context.toolCallId);
			const box = new Box(1, 1, (text) => theme.bg("customMessageBg", text));
			if (name) {
				box.addChild(
					new Text(
						theme.fg("customMessageLabel", theme.bold("[skill] ")) +
							theme.fg("customMessageText", name) + theme.fg("dim", expandHint()),
						0,
						0,
					),
				);
				return box;
			}

			const spinner = loadingSpinners.get(context.toolCallId) ?? new SkillLoadSpinner(
				context.invalidate,
				(frame) =>
					theme.fg("customMessageLabel", theme.bold("[skill] ")) +
					theme.fg("customMessageText", frame) + theme.fg("dim", expandHint()),
			);
			loadingSpinners.set(context.toolCallId, spinner);
			spinner.start();
			box.addChild(spinner);
			return box;
		},

		renderResult: () => new Text("", 0, 0),
		async execute(toolCallId, params, _signal, _onUpdate, ctx) {
			try {
				const skill = await loadSkill(params.path);
				loadedSkillNames.set(
					toolCallId,
					skill.isActivation ? skill.name : `${skill.name}/${skill.relativePath}`,
				);
				return {
					content: [
						{
							type: "text" as const,
							text: formatSkillToolOutput(skill),
						},
					],
					details: { name: skill.name, path: skill.path },
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unable to load skill.";
				return {
					content: [{ type: "text" as const, text: `Skill load failed: ${message}` }],
					details: { error: message },
					isError: true,
				};
			} finally {
				loadingSpinners.get(toolCallId)?.stop();
				loadingSpinners.delete(toolCallId);
			}
		}, 
	});
}
