#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";

/**
 * Convert ASCII tree structure into a list of file paths.
 */
function parseTreeStructure(lines) {
    const stack = [];
    const result = [];

    for (let line of lines) {
        if (!line.trim()) continue;
        const clean = line.replace(/[│├└─]/g, "").trim();
        const depth = (line.match(/    /g) || []).length;
        stack[depth] = clean;
        result.push(stack.slice(0, depth + 1).join("/"));
    }

    return result;
}

function parseFlatStructure(lines) {
    return lines.map(l => l.trim()).filter(Boolean);
}

function isTreeFormat(lines) {
    return lines.some(l => /├──|└──/.test(l));
}

function createStructure(structureFile) {
    if (!fs.existsSync(structureFile)) {
        console.log(chalk.red(`❌ File not found: ${structureFile}`));
        process.exit(1);
    }

    const content = fs.readFileSync(structureFile, "utf-8");
    const lines = content.split(/\r?\n/);

    const paths = isTreeFormat(lines)
        ? parseTreeStructure(lines)
        : parseFlatStructure(lines);

    for (const p of paths) {
        const fullPath = path.resolve(process.cwd(), p);
        const dir = path.dirname(fullPath);
        fs.mkdirSync(dir, { recursive: true });

        if (p.endsWith("/")) continue;

        if (!fs.existsSync(fullPath)) {
            fs.writeFileSync(fullPath, "");
            console.log(chalk.green("✅ Created:"), chalk.cyan(p));
        } else {
            console.log(chalk.yellow("⚠️ Skipped (already exists):"), chalk.cyan(p));
        }
    }
}

// Entry point
const structureFile = process.argv[2];
if (!structureFile) {
    console.log(chalk.red("Usage: mkstruct <structure-file>"));
    console.log(chalk.gray("Example: mkstruct structure.txt"));
    process.exit(1);
}

createStructure(structureFile);
