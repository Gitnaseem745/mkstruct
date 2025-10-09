#!/usr/bin/env node
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { program } from "commander";
import chalk from "chalk";

program
    .name("mkstruct")
    .description("Generate nested file/folder structure from flat or ASCII tree text")
    .argument("[file]", "structure file (omit to read from stdin)")
    .option("-d, --dry-run", "show actions without creating files")
    .option("-f, --force", "overwrite existing files")
    .option("-s, --stdin", "read structure from stdin")
    .option("-v, --verbose", "verbose logging")
    .parse();

const opts = program.opts();

/* -------------------- Read Input -------------------- */
async function readInput(argFile) {
    if (opts.stdin) {
        const stdin = await new Promise((res) => {
            let data = "";
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", (chunk) => (data += chunk));
            process.stdin.on("end", () => res(data));
        });
        return stdin;
    }
    if (!argFile) {
        throw new Error("No input file provided. Use --stdin or provide a filename.");
    }
    return fs.readFile(argFile, "utf8");
}

/* -------------------- Detect Format -------------------- */
function isTreeFormat(lines) {
    return lines.some((l) => /[├└]──/.test(l));
}

/* -------------------- Parse Flat Format -------------------- */
function parseFlatStructure(lines) {
    return lines.map((l) => l.trim()).filter(Boolean);
}

/* -------------------- Parse Tree Format -------------------- */
function parseTreeStructure(lines) {
    const stack = [];
    const result = [];

    for (let raw of lines) {
        const line = raw.replace(/\t/g, "    ");
        if (!line.trim()) continue;

        // Match tree characters and extract the name
        const m = line.match(/^(.*?)([├└]──\s*)(.+)$/);
        if (!m) continue;

        const prefix = m[1];
        const name = m[3].trim();

        // Calculate depth by counting visible tree characters in the prefix
        // Count │ and spaces - each indentation level adds 4 characters (│   )
        const depth = Math.floor(prefix.length / 4);

        stack[depth] = name;
        stack.length = depth + 1;

        const fullPath = stack.join(path.sep);
        result.push(fullPath);
    }

    return result;
}

/* -------------------- Helpers -------------------- */
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

    const dir = path.dirname(fullPath);
    await ensureDir(dir, dryRun);

    const exists = fsSync.existsSync(fullPath);
    if (exists && !force) {
        console.log(chalk.yellow(`⚠️ Skipped (exists): ${rel}`));
        return;
    }

    if (dryRun) {
        console.log(chalk.gray(`[DRY] create file: ${rel}`));
        return;
    }

    await fs.writeFile(fullPath, "", { flag: force ? "w" : "wx" });
    console.log(chalk.green(`✅ Created file: ${rel}`));
}

/* -------------------- Main -------------------- */
(async () => {
    try {
        const argFile = program.args[0];
        const raw = await readInput(argFile);
        const lines = raw.split(/\r?\n/);

        const rawPaths = isTreeFormat(lines)
            ? parseTreeStructure(lines)
            : parseFlatStructure(lines);

        // Sort by depth so folders are created before their children
        const sortedPaths = rawPaths.sort(
            (a, b) => a.split(path.sep).length - b.split(path.sep).length
        );

        for (const p of sortedPaths) {
            const fullPath = path.resolve(process.cwd(), p);

            // Detect if it's a file or folder
            const isFile = path.extname(fullPath) !== "";

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
