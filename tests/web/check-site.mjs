import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import crypto from "node:crypto";

const root = process.cwd();
const includeRoots = ["docs", "examples", "templates"];

async function walk(directory) {
  const entries = await fs.readdir(path.join(root, directory), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(relative));
    else if (entry.name.endsWith(".md")) files.push(relative);
  }
  return files;
}

const expected = ["README.md", "CONTRIBUTING.md"];
for (const directory of includeRoots) expected.push(...await walk(directory));
expected.sort();

const context = { window: {} };
vm.runInNewContext(await fs.readFile(path.join(root, "site-content.js"), "utf8"), context);
const docs = context.window.DOCS;
const actual = docs.map((doc) => doc.path).sort();
if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("source corpus mismatch");

const index = await fs.readFile(path.join(root, "index.html"), "utf8");
if (!index.includes("seed 7af8f714")) throw new Error("direction contract missing");
if (/<(?:script|link)[^>]+(?:src|href)=["']https?:/i.test(index)) throw new Error("external runtime dependency found");

const manifest = JSON.parse(await fs.readFile(path.join(root, "site-manifest.json"), "utf8"));
const manifestByPath = new Map(manifest.map((item) => [item.path, item]));
const navigation = [];
const slug = (value) => value.toLowerCase().trim().replace(/<[^>]+>/g, "").replace(/[\s/]+/g, "-").replace(/[^\p{L}\p{N}._-]/gu, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "section";
const headingIds = (entry) => {
  const used = new Map();
  return new Set(entry.headings.map((heading) => {
    const base = slug(heading.text);
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  }));
};
for (const doc of docs) {
  const raw = await fs.readFile(path.join(root, doc.path), "utf8");
  if (doc.raw !== raw) throw new Error(`payload mismatch: ${doc.path}`);
  if (!index.includes(`href="${doc.path}"`)) throw new Error(`fallback source missing: ${doc.path}`);
  const entry = manifestByPath.get(doc.path);
  if (!entry || entry.bytes !== Buffer.byteLength(raw)) throw new Error(`manifest mismatch: ${doc.path}`);
  const local = entry.headings.filter((heading) => heading.level === 2 || heading.level === 3);
  navigation.push({
    path: doc.path,
    directActions: 1,
    headingTargets: entry.headings.length,
    localNavigationRequired: local.length >= 8,
    localNavigationMapped: local.length
  });

  for (const match of raw.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const [target, anchor] = match[1].split("#");
    if (/^(?:[a-z]+:|\/)/i.test(target)) continue;
    if (target && !target.endsWith(".md")) continue;
    const resolved = target ? path.posix.normalize(path.posix.join(path.posix.dirname(doc.path), decodeURIComponent(target))) : doc.path;
    const targetEntry = manifestByPath.get(resolved);
    if (!targetEntry) throw new Error(`broken Markdown link: ${doc.path} -> ${match[1]}`);
    if (anchor && !headingIds(targetEntry).has(slug(decodeURIComponent(anchor)))) {
      throw new Error(`broken Markdown anchor: ${doc.path} -> ${match[1]}`);
    }
  }
}

for (const match of index.matchAll(/href="#\/(.+?\.md)\/([^"#]+)"/g)) {
  const entry = manifestByPath.get(match[1]);
  if (!entry) throw new Error(`home route source missing: ${match[1]}`);
  const ids = entry.headings.map((heading) => slug(heading.text));
  if (!ids.includes(match[2])) throw new Error(`home route heading missing: ${match[1]}#${match[2]}`);
}

const assets = ["index.html", "styles.css", "app.js", "assets/fonts/SUITE-Heavy.woff2"];
let assetBytes = 0;
for (const asset of assets) assetBytes += (await fs.stat(path.join(root, asset))).size;
if (assetBytes > 1024 * 1024) throw new Error(`local shell assets exceed 1 MB: ${assetBytes}`);

const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
const report = {
  corpusCount: docs.length,
  sourceManifestDigest: digest(JSON.stringify(manifest)),
  renderedBundleDigest: digest(await fs.readFile(path.join(root, "index.html")) + await fs.readFile(path.join(root, "styles.css")) + await fs.readFile(path.join(root, "app.js")) + await fs.readFile(path.join(root, "site-content.js"))),
  shellAssetBytes: assetBytes,
  navigation
};

if (process.argv.includes("--write-report")) {
  await fs.mkdir(path.join(root, ".impeccable/evidence"), { recursive: true });
  await fs.writeFile(path.join(root, ".impeccable/evidence/build-report.json"), `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`PASS ${docs.length} sources, ${assetBytes} shell bytes`);
