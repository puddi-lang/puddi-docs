#!/usr/bin/env node
// Compiles every complete Puddi example in the book with `pud`, and runs the
// ones followed by an expected-output block.
//
//   node tools/check-examples.mjs [--pud path] [--jobs n] [filter...]
//
// A ```puddi block is a complete example when it declares `fn main` or a
// `test` block; other blocks are fragments and are skipped. Words after the
// language name change how a block is checked:
//
//   ignore    skip the block
//   fail      the block must be rejected by `pud check`
//   browser   check it for the browser target
//
// A ```text,output block right after a complete example is its expected
// output: the example is run with `pud run` and stdout plus stderr must match.
// An example made only of `test` blocks is run with `pud test`.

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir, cpus } from "node:os";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
let pud = process.env.PUD || "pud";
let jobs = Math.min(cpus().length, 4);
const filters = [];
for (let i = 0; i < args.length; i++) {
    if (args[i] === "--pud") pud = args[++i];
    else if (args[i] === "--jobs" || args[i] === "-j") jobs = Number(args[++i]);
    else filters.push(args[i]);
}
// examples run in their own directories, so a relative path must be resolved first
if (/[\\/]/.test(pud)) pud = resolve(pud);

// generated from the puddi repository, which tests its own examples
const SKIP = new Set(["reference/spec.md", "reference/changelog.md"]);

function markdownFiles(dir) {
    const out = [];
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) out.push(...markdownFiles(p));
        else if (e.name.endsWith(".md")) out.push(p);
    }
    return out.sort();
}

function blocks(text) {
    const out = [];
    const re = /^```([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm;
    let m;
    while ((m = re.exec(text))) {
        const line = text.slice(0, m.index).split("\n").length;
        out.push({ info: m[1].trim().split(/[,\s]+/), body: m[2], line, start: m.index, end: re.lastIndex });
    }
    return out;
}

const cases = new Map();
for (const file of ["src", "src-zh-CN"].flatMap(dir => markdownFiles(join(root, dir)))) {
    const rel = relative(root, file).split("\\").join("/");
    if (SKIP.has(rel.split("/").slice(1).join("/"))) continue;
    const text = readFileSync(file, "utf8");
    const bs = blocks(text);
    bs.forEach((b, i) => {
        if (b.info[0] !== "puddi" || b.info.includes("ignore")) return;
        const hasMain = /^\s*(async\s+)?fn main\(/m.test(b.body);
        const hasTest = /^\s*test "/m.test(b.body);
        if (!hasMain && !hasTest) return;
        const next = bs[i + 1];
        const output = next && next.info[0] === "text" && next.info.includes("output") && text.slice(b.end, next.start).trim() === ""
            ? next.body
            : null;
        const name = `${rel}:${b.line}`;
        if (filters.length && !filters.some((f) => name.includes(f))) return;
        const testOnly = hasTest && !hasMain;
        const key = JSON.stringify([b.body, b.info, output, testOnly]);
        if (!cases.has(key)) cases.set(key, { name, body: b.body, info: b.info, output, testOnly });
    });
}

function run(cmd, argv, cwd) {
    return new Promise((resolve) => {
        const child = spawn(cmd, argv, { cwd });
        let out = "";
        child.stdout.on("data", (d) => (out += d));
        child.stderr.on("data", (d) => (out += d));
        const timer = setTimeout(() => child.kill(), 120_000);
        child.on("error", (e) => {
            clearTimeout(timer);
            resolve({ code: -1, out: String(e) });
        });
        child.on("close", (code) => {
            clearTimeout(timer);
            resolve({ code, out: out.replace(/\r\n/g, "\n") });
        });
    });
}

const work = mkdtempSync(join(tmpdir(), "puddi-docs-"));

async function check(c, index) {
    const dir = join(work, String(index));
    mkdirSync(dir);
    writeFileSync(join(dir, "main.pud"), c.body);
    const target = c.info.includes("browser") ? ["--target", "browser"] : [];
    if (c.info.includes("fail")) {
        const r = await run(pud, ["check", "main.pud", ...target], dir);
        return r.code !== 0 ? null : "compiled, but the example is marked `fail`";
    }
    if (c.output !== null) {
        const r = await run(pud, ["run", "main.pud"], dir);
        if (r.code !== 0) return `exit code ${r.code}\n${r.out}`;
        if (r.out.trimEnd() !== c.output.trimEnd()) return `output differs\n--- got\n${r.out}--- expected\n${c.output}`;
        return null;
    }
    const r = await run(pud, [c.testOnly ? "test" : "check", "main.pud", ...target], dir);
    return r.code === 0 ? null : `exit code ${r.code}\n${r.out}`;
}

const failures = [];
const examples = [...cases.values()];
let next = 0;
await Promise.all(
    Array.from({ length: Math.max(1, jobs) }, async () => {
        while (next < examples.length) {
            const i = next++;
            const err = await check(examples[i], i);
            if (err) failures.push(`${examples[i].name}: ${err}`);
        }
    }),
);
rmSync(work, { recursive: true, force: true });

for (const f of failures) console.log(`FAIL ${f}\n`);
console.log(`${examples.length - failures.length} of ${examples.length} examples passed`);
process.exit(failures.length ? 1 : 0);
