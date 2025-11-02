#!/usr/bin/env node
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { program } from "commander";
import chalk from "chalk";
import { normalizeTree, hasTreeStructure } from "../src/normalizer.js";

program
    .name("mkstruct")
    .description("Generate nested file/folder structure from flat or ASCII tree text")
    .argument("[file]", "structure file (omit to read from stdin)")
    .option("-d, --dry-run", "show actions without creating files")
    .option("-f, --force", "overwrite existing files")
    .option("-s, --structure <text>", "directly provide structure as string")
    .option("--stdin", "read structure from stdin")
    .option("-v, --verbose", "verbose logging")
    .parse();

const opts = program.opts();

async function readInput(argFile) {
    if (opts.structure) return opts.structure;

    if (opts.stdin) {
        return new Promise((res) => {
            let data = "";
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", (chunk) => (data += chunk));
            process.stdin.on("end", () => res(data));
        });
    }

    if (!argFile) {
        throw new Error("No input provided. Use -s <structure>, --stdin, or provide a filename.");
    }
    return fs.readFile(argFile, "utf8");
}

function isTreeFormat(lines) {
    return hasTreeStructure(lines.join('\n'));
}

function parseFlatStructure(lines) {
    return lines.map((l) => l.trim()).filter(Boolean);
}

function parseTreeStructure(lines) {
    const input = lines.join('\n');
    const normalizedInput = normalizeTree(input);
    const normalizedLines = normalizedInput.split(/\r?\n/);

    if (opts.verbose && input !== normalizedInput) {
        console.log(chalk.blue('ℹ️  Tree structure normalized'));
    }

    const stack = [];
    const result = [];
    let hasRoot = false;

    for (let raw of normalizedLines) {
        const line = raw.replace(/\t/g, "    ");
        if (!line.trim()) continue;

        const rootMatch = line.match(/^([^\s├└│]+)$/);
        if (rootMatch) {
            const name = rootMatch[1].trim();
            stack[0] = name;
            stack.length = 1;
            result.push(name);
            hasRoot = true;
            continue;
        }

        const m = line.match(/^(.*?)(├──|└──)\s*(.+)$/);
        if (!m) continue;

        const prefix = m[1];
        const name = m[3].trim();

        let depth = 0;
        let i = 0;
        while (i < prefix.length) {
            if (prefix[i] === '│') {
                depth++;
                i += 4;
            } else {
                i++;
            }
        }

        if (hasRoot) depth += 1;

        stack[depth] = name;
        stack.length = depth + 1;

        result.push(stack.join(path.sep));
    }

    return result;
}

async function ensureDir(targetPath, dry = false) {
    if (!fsSync.existsSync(targetPath)) {
        if (dry) {
            console.log(chalk.gray(`[DRY] mkdir: ${path.relative(process.cwd(), targetPath)}`));
        } else {
            await fs.mkdir(targetPath, { recursive: true });
            console.log(chalk.green(`📁 Created folder: ${path.relative(process.cwd(), targetPath)}`));
        }
    }
}

async function createFile(fullPath, { dryRun, force }) {
    const rel = path.relative(process.cwd(), fullPath);
    if (rel.startsWith("..") || (path.isAbsolute(rel) && !rel.startsWith("."))) {
        throw new Error(`Refusing to write outside CWD: ${fullPath}`);
    }

    await ensureDir(path.dirname(fullPath), dryRun);

    const exists = fsSync.existsSync(fullPath);
    if (exists && !force) {
        console.log(chalk.yellow(`⚠️  Skipped (exists): ${rel}`));
        return;
    }

    if (dryRun) {
        console.log(chalk.gray(`[DRY] create file: ${rel}`));
        return;
    }

    await fs.writeFile(fullPath, "", { flag: force ? "w" : "wx" });
    console.log(chalk.green(`✅ Created file: ${rel}`));
}

const COMMON_FILES = [
    'Makefile', 'Dockerfile', 'Rakefile', 'Gemfile', 'Procfile',
    'LICENSE', 'README', 'CHANGELOG', 'CONTRIBUTING',
    '.gitignore', '.dockerignore', '.npmignore', '.gitattributes',
    '.editorconfig', '.env', '.env.example', '.env.local'
];

(async () => {
    try {
        const argFile = program.args[0];
        const raw = await readInput(argFile);
        const lines = raw.split(/\r?\n/);

        const rawPaths = isTreeFormat(lines)
            ? parseTreeStructure(lines)
            : parseFlatStructure(lines);

        const sortedPaths = rawPaths.sort(
            (a, b) => a.split(path.sep).length - b.split(path.sep).length
        );

        for (const p of sortedPaths) {
            const fullPath = path.resolve(process.cwd(), p);
            const endsWithSlash = p.endsWith('/') || p.endsWith(path.sep);
            const hasExtension = path.extname(p) !== "";
            const basename = path.basename(p);
            const isCommonFile = COMMON_FILES.some(f =>
                basename === f || basename.toLowerCase() === f.toLowerCase()
            );

            const isFile = !endsWithSlash && (hasExtension || isCommonFile);

            if (isFile) {
                await createFile(fullPath, { dryRun: opts.dryRun, force: opts.force });
            } else {
                await ensureDir(fullPath, opts.dryRun);
            }
        }
    } catch (err) {
        console.error(chalk.red("Error:"), err.message);
        process.exit(1);
    }
})();
