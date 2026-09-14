import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { discoverSkills, formatSkillToolOutput, loadSkill, readSkillMetadata, readSkillName } from "./skill.js";

const directories: string[] = [];

afterEach(async () => {
	await Promise.all(directories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })));
});

async function fixture(filename: string, content: string) {
	const directory = await mkdtemp(join(tmpdir(), "pi-better-skills-"));
	directories.push(directory);
	const path = join(directory, filename);
	await writeFile(path, content);
	return path;
}

describe("readSkillName", () => {
	it("reads a frontmatter name", () => {
		expect(readSkillName("---\nname: test-skill\n---\n# Test")).toBe("test-skill");
	});

	it("returns undefined without frontmatter", () => {
		expect(readSkillName("# Test")).toBeUndefined();
	});
});

describe("readSkillMetadata", () => {
	it("reads valid aliases without changing the canonical name", () => {
		expect(readSkillMetadata("---\nname: plan-driven-development\naliases: [pdd, 'planning']\n---\n# Test")).toEqual({
		name: "plan-driven-development",
		aliases: ["pdd", "planning"],
	});
	});

	it("ignores malformed aliases and de-duplicates valid aliases", () => {
		expect(readSkillMetadata("---\naliases: [pdd, PDD, pdd, has_space]\n---\n# Test").aliases).toEqual(["pdd"]);
	});
});

describe("discoverSkills", () => {
	it("discovers skill roots and does not recurse into their references", async () => {
		const directory = await mkdtemp(join(tmpdir(), "pi-better-skills-"));
		directories.push(directory);
		await mkdir(join(directory, "plan-driven-development"));
		await writeFile(
			join(directory, "plan-driven-development", "SKILL.md"),
			"---\nname: plan-driven-development\naliases: [pdd]\n---\n# Test",
		);
		await mkdir(join(directory, "plan-driven-development", "references"));
		await writeFile(join(directory, "plan-driven-development", "references", "SKILL.md"), "# Not a skill");

		await expect(discoverSkills([directory])).resolves.toEqual([
			{ name: "plan-driven-development", aliases: ["pdd"], path: join(directory, "plan-driven-development", "SKILL.md") },
		]);
	});
});

describe("loadSkill", () => {
	it("loads SKILL.md and uses its frontmatter name", async () => {
		const path = await fixture("SKILL.md", "---\nname: test-skill\n---\n# Test");
		await expect(loadSkill(path)).resolves.toMatchObject({ name: "test-skill" });
		expect((await loadSkill(path)).path).toMatch(/\/SKILL\.md$/);
	});

	it("uses the parent directory when frontmatter has no name", async () => {
		const path = await fixture("SKILL.md", "# Test");
		await expect(loadSkill(path)).resolves.toMatchObject({ name: basename(dirname(path)) });
	});

	it("loads a reference contained by a skill directory without activating it", async () => {
		const directory = await mkdtemp(join(tmpdir(), "pi-better-skills-"));
		directories.push(directory);
		await writeFile(join(directory, "SKILL.md"), "---\nname: test-skill\n---\n# Test");
		await mkdir(join(directory, "references"));
		const path = join(directory, "references", "planning.md");
		await writeFile(path, "# Planning");

		const skill = await loadSkill(path);
		expect(skill).toMatchObject({
			name: "test-skill",
			relativePath: "references/planning.md",
			isActivation: false,
		});
		expect(formatSkillToolOutput(skill)).toContain("<skill-reference name=\"test-skill\"");
	});

	it("rejects relative paths and files outside a skill directory", async () => {
		await expect(loadSkill("SKILL.md")).rejects.toThrow("must be absolute");
		const path = await fixture("notes.md", "# Notes");
		await expect(loadSkill(path)).rejects.toThrow("must be contained by a directory with SKILL.md");
	});

	it("rejects empty skill files", async () => {
		const path = await fixture("SKILL.md", "  \n");
		await expect(loadSkill(path)).rejects.toThrow("Skill file is empty");
	});
});
