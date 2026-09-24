/* eslint-disable no-console */
/*
 * build-query-index.js — LOCAL DEV ONLY.
 *
 * Generates a /query-index.json that mirrors what tools.aem.live produces
 * server-side from helix-query.yaml, so the dynamic cards-article variant can
 * render on `aem up` (which does NOT run the query pipeline). Scans the
 * migrated .plain.html pages under content/us/en, extracts the indexed columns
 * from each page's metadata block, and writes content/query-index.json.
 *
 * Run: node tools/importer/build-query-index.js
 * The real runtime index is produced by tools.aem.live; this is a dev aid.
 */
const fs = require('fs');
const path = require('path');

const CONTENT = path.resolve(__dirname, '../../content');
const ROOT = path.join(CONTENT, 'us/en');
const OUT = path.join(CONTENT, 'query-index.json');

function walk(dir, acc = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.name.endsWith('.plain.html')) acc.push(full);
  });
  return acc;
}

// Pull "<div>Key</div><div>Value</div>" pairs out of the trailing .metadata block.
function readMetadata(html) {
  const meta = {};
  // Isolate the trailing metadata block; fall back to whole doc.
  const start = html.lastIndexOf('<div class="metadata">');
  const scope = start >= 0 ? html.substring(start) : html;
  // Match each key/value row: <div><div>Key</div><div>Value…</div></div>
  const re = /<div><div>([^<]+)<\/div><div>([\s\S]*?)<\/div><\/div>/g;
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(scope))) {
    const key = m[1].trim().toLowerCase();
    const val = m[2].replace(/<[^>]+>/g, '').trim();
    if (key && !(key in meta)) meta[key] = val;
  }
  return meta;
}

// First image src on the page (fallback card image when no explicit meta image).
function firstImage(html) {
  const m = html.match(/<img[^>]*src="([^"]+)"/);
  return m ? m[1] : '';
}

const files = walk(ROOT);
const data = [];
files.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const rel = file.substring(CONTENT.length).replace(/\.plain\.html$/, '');
  const meta = readMetadata(html);
  data.push({
    path: rel,
    title: meta.title || '',
    description: meta.description || '',
    image: meta.image || firstImage(html),
    date: meta.date || '',
    activity: meta.activity || '',
    robots: meta.robots || '',
    lastModified: String(Math.floor(fs.statSync(file).mtimeMs / 1000)),
  });
});

// Sort newest-first so the dev index matches the block's own ordering.
data.sort((a, b) => Number(b.lastModified) - Number(a.lastModified));

const json = {
  total: data.length,
  offset: 0,
  limit: data.length,
  data,
  ':type': 'sheet',
};

fs.writeFileSync(OUT, JSON.stringify(json, null, 2));
console.log(`Wrote ${OUT} with ${data.length} entries`);
