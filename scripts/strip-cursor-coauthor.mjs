import fs from "node:fs";

const messageFile = process.argv[2];
if (!messageFile) {
  process.exit(0);
}

const content = fs.readFileSync(messageFile, "utf8");
const next = content.replace(/^Co-authored-by: Cursor <cursoragent@cursor.com>\s*\r?\n?/gm, "");
if (next !== content) {
  fs.writeFileSync(messageFile, next);
}
