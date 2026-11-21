#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, relative } from "node:path/posix";

if (process.argv[2] === "supports") {
  process.exit(process.argv[3] === "html" ? 0 : 1);
}

const [context, book] = JSON.parse(readFileSync(0, "utf8"));
const chinese = context.config.book.language === "zh-CN";

function addLinks(items) {
  for (const { Chapter: chapter } of items) {
    if (!chapter?.path) continue;
    const page = chapter.path.replace(/\.md$/, ".html");
    const counterpart = chinese ? page : `zh-CN/${page}`;
    const here = dirname(chinese ? `zh-CN/${page}` : page);
    const link = relative(here, counterpart);
    const label = chinese ? "English" : "简体中文";
    const language = chinese ? "en" : "zh-CN";
    const switcher = `<p class="book-language"><a href="${link}" lang="${language}" hreflang="${language}">${label}</a></p>`;
    chapter.content = chapter.content.replace(/^# .+$/m, heading => `${heading}\n\n${switcher}`);
    addLinks(chapter.sub_items);
  }
}

addLinks(book.items);
process.stdout.write(JSON.stringify(book));
