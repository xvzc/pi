import { basename, dirname, isAbsolute, relative, resolve } from "node:path";
import type { Dirent } from "node:fs";
import { realpath, readFile, readdir, stat } from "node:fs/promises";

export type LoadedSkill = {
	content: string;
	name: string;
	path: string;
	rootPath: string;
	relativePath: string;
	isActivation: boolean;
};

export type SkillMetadata = {
	name?: string;
	aliases: string[];
};

export type DiscoveredSkill = {
	aliases: string[];
	name: string;
	path: string;
};

export function formatSkillToolOutput(skill: LoadedSkill): string {
	const tag = skill.isActivation ? "skill" : "skill-reference";
	const referenceNote = skill.isActivation ? `\nReferences are relative to ${dirname(skill.path)}.\n` : "\n";
	return `<${tag} name="${skill.name}" location="${skill.path}">${referenceNote}\n${stripFrontmatter(skill.content).trim()}\n</${tag}>`;
}

export async function loadSkill(path: string): Promise<LoadedSkill> {
	if (!isAbsolute(path)) {
		throw new Error("Skill paths must be absolute.");
	}
	const requestedPath = resolve(path);

	let resolvedPath: string;
	try {
		resolvedPath = await realpath(requestedPath);
	} catch {
		throw new Error(`Skill file not found: ${requestedPath}`);
	}

	if (!(await stat(resolvedPath)).isFile()) {
		throw new Error(`Skill path must resolve to a regular file: ${requestedPath}`);
	}

	const rootPath = await findSkillRoot(dirname(resolvedPath));
	if (!rootPath) {
		throw new Error(`Skill reference must be contained by a directory with SKILL.md: ${requestedPath}`);
	}

	const relativePath = relative(rootPath, resolvedPath);
	const content = await readFile(resolvedPath, "utf8");
	if (content.trim().length === 0) {
		throw new Error(`Skill file is empty: ${resolvedPath}`);
	}

	const skillFile = await readFile(resolve(rootPath, "SKILL.md"), "utf8");
	return {
		content,
		name: readSkillName(skillFile) ?? basename(rootPath),
		path: resolvedPath,
		rootPath,
		relativePath,
		isActivation: relativePath === "SKILL.md",
	};
}

export async function discoverSkills(roots: string[]): Promise<DiscoveredSkill[]> {
	const discovered: DiscoveredSkill[] = [];
	const seenPaths = new Set<string>();

	for (const root of roots) {
		await discoverSkillsInDirectory(root, discovered, seenPaths);
	}

	return discovered;
}

async function discoverSkillsInDirectory(
	directory: string,
	discovered: DiscoveredSkill[],
	seenPaths: Set<string>,
): Promise<void> {
	let entries: Dirent<string>[];
	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch {
		return;
	}

	const skillEntry = entries.find((entry) => entry.name === "SKILL.md" && entry.isFile());
	if (skillEntry) {
		const path = resolve(directory, skillEntry.name);
		if (seenPaths.has(path)) return;

		try {
			const content = await readFile(path, "utf8");
			const metadata = readSkillMetadata(content);
			const name = metadata.name ?? basename(directory);
			discovered.push({ aliases: metadata.aliases, name, path });
			seenPaths.add(path);
		} catch {
			// Ignore unreadable skills. The built-in loader reports its own diagnostics.
		}
		return;
	}

	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name === "node_modules") continue;
		await discoverSkillsInDirectory(resolve(directory, entry.name), discovered, seenPaths);
	}
}

async function findSkillRoot(startPath: string): Promise<string | undefined> {
	let directory = startPath;
	while (true) {
		try {
			const skillPath = await realpath(resolve(directory, "SKILL.md"));
			if ((await stat(skillPath)).isFile()) return directory;
		} catch {
			// This ancestor is not a skill root.
		}

		const parent = dirname(directory);
		if (parent === directory) return undefined;
		directory = parent;
	}
}

export function readSkillMetadata(content: string): SkillMetadata {
	const frontmatter = readFrontmatter(content);
	if (!frontmatter) return { aliases: [] };

	const name = frontmatter.match(/^name:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]?.trim();
	const aliases = frontmatter.match(/^aliases:\s*\[([^\]\r\n]*)\]\s*$/m)?.[1]
		.split(",")
		.map((alias) => alias.trim().replace(/^(["'])(.*)\1$/, "$2"))
		.filter((alias) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(alias)) ?? [];

	return { aliases: [...new Set(aliases)], name: name || undefined };
}

export function readSkillName(content: string): string | undefined {
	return readSkillMetadata(content).name;
}

function readFrontmatter(content: string): string | undefined {
	return content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/)?.[1];
}

function stripFrontmatter(content: string): string {
	const normalized = content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	if (!normalized.startsWith("---")) return normalized;

	const endIndex = normalized.indexOf("\n---", 3);
	return endIndex === -1 ? normalized : normalized.slice(endIndex + 4).trim();
}
