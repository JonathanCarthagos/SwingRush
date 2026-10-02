import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { imageJpegOptions } from "./image-compression.mjs";

const targets = process.argv.slice(2);
const roots = targets.length > 0 ? targets : ["public"];

const files = (await Promise.all(roots.map(collectJpegs))).flat();

for (const file of files) {
  const input = await readFile(file);
  const output = await sharp(input).rotate().jpeg(imageJpegOptions).toBuffer();

  if (output.length >= input.length) {
    console.log(`keep ${file}`);
    continue;
  }

  await writeFile(file, output);
  console.log(
    `compress ${file} ${formatKb(input.length)} -> ${formatKb(output.length)}`,
  );
}

async function collectJpegs(entry) {
  const info = await stat(entry);
  if (info.isDirectory()) {
    const names = await readdir(entry);
    const nested = await Promise.all(
      names.map((name) => collectJpegs(path.join(entry, name))),
    );
    return nested.flat();
  }

  return /\.jpe?g$/i.test(entry) ? [entry] : [];
}

function formatKb(bytes) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
