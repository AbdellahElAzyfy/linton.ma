// Builds the site and packs exactly what a cPanel "Setup Node.js App" server
// needs into dist/linton-ma-cpanel.zip.   npm run pack:cpanel
//
// The server never builds: shared hosting has tight CPU/memory/time limits, so
// the build happens here and only its output is uploaded. See DEPLOY.md.
//
// What goes in the zip, and what stays out:
//   app.js, next.config.mjs   startup file / config loaded at runtime
//   package.json              runtime dependencies only (no dev tooling)
//   package-lock.json         matching lock, so the server installs the same versions
//   public/                   static files
//   .next/                    the build, minus caches, source maps and dev/trace files
//   NOT node_modules          cPanel's Node.js Selector creates its own node_modules
//                             (a symlink into a per-app virtual environment) and
//                             fails or misbehaves if the folder already exists.
//   NOT app/, components/ …   already compiled into .next
//
// Zip is written by hand (node:zlib) so it needs no zip/tar tool, always uses
// "/" separators, and sets Unix permissions.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { crc32, deflateRawSync } from "node:zlib";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, posix, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outFile = join(root, "dist", "linton-ma-cpanel.zip");
const require = createRequire(import.meta.url);

const fail = (message) => {
  console.error(`\n✗ ${message}`);
  process.exit(1);
};

// ---- 1. Build --------------------------------------------------------------
if (!process.argv.includes("--no-build")) {
  console.log("Building (next build)…");
  const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next", { paths: [root] }), "build"], {
    cwd: root,
    stdio: "inherit",
    // Standalone output can't be served by app.js's custom server.
    env: { ...process.env, NEXT_OUTPUT: "" },
  });
  if (result.status !== 0) fail("next build failed.");
}
if (!existsSync(join(root, ".next", "BUILD_ID"))) fail("No .next build found — run without --no-build.");

// ---- 2. Runtime package.json + matching lock -------------------------------
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const runtimePkg = {
  name: pkg.name,
  version: pkg.version,
  private: true,
  scripts: { start: "node app.js" },
  dependencies: pkg.dependencies,
  engines: pkg.engines,
};

const work = mkdtempSync(join(tmpdir(), "linton-pack-"));
let runtimeLock;
try {
  writeFileSync(join(work, "package.json"), JSON.stringify(runtimePkg, null, 2) + "\n");
  copyFileSync(join(root, "package-lock.json"), join(work, "package-lock.json"));
  console.log("Pruning package-lock.json to runtime dependencies…");
  // One command string (not an args array) because npm is npm.cmd on Windows and needs a shell.
  const npm = spawnSync("npm install --package-lock-only --omit=dev --ignore-scripts --no-audit --no-fund", {
    cwd: work,
    stdio: "inherit",
    shell: true,
  });
  if (npm.status !== 0) fail("npm could not prune the lockfile.");
  runtimeLock = readFileSync(join(work, "package-lock.json"));
} finally {
  rmSync(work, { recursive: true, force: true });
}

// ---- 3. Collect files ------------------------------------------------------
const NEXT_SKIP_TOP = new Set(["cache", "dev", "standalone", "types", "diagnostics", "trace", "trace-build", "lock"]);
const entries = [];
const add = (name, data, mode = 0o644) => entries.push({ name, data, mode });

function walk(dir, rel, keep) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, item.name);
    const name = posix.join(rel, item.name);
    if (!keep(name, item)) continue;
    if (item.isDirectory()) walk(abs, name, keep);
    else if (item.isFile()) add(name, readFileSync(abs));
  }
}

add("app.js", readFileSync(join(root, "app.js")));
add("next.config.mjs", readFileSync(join(root, "next.config.mjs")));
add("package.json", Buffer.from(JSON.stringify(runtimePkg, null, 2) + "\n"));
add("package-lock.json", runtimeLock);
walk(join(root, "public"), "public", () => true);
walk(join(root, ".next"), ".next", (name) => {
  const top = name.split("/")[1];
  return !NEXT_SKIP_TOP.has(top) && !name.endsWith(".map");
});
entries.sort((a, b) => (a.name < b.name ? -1 : 1));

if (entries.some((e) => e.name.split("/").includes("node_modules"))) fail("node_modules ended up in the package.");
for (const required of ["app.js", "package.json", "package-lock.json", ".next/BUILD_ID", ".next/required-server-files.json"]) {
  if (!entries.some((e) => e.name === required)) fail(`Package is missing ${required}.`);
}

// ---- 4. Zip ----------------------------------------------------------------
function buildZip(files) {
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const parts = [];
  const central = [];
  let offset = 0;

  for (const { name, data, mode } of files) {
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    let method = 8;
    let body = deflateRawSync(data, { level: 9 });
    if (body.length >= data.length) {
      method = 0;
      body = data;
    }

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // flag: UTF-8 file names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    parts.push(local, nameBuf, body);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE((3 << 8) | 20, 4); // made by: Unix, spec 2.0 (so permissions are honoured)
    entry.writeUInt16LE(20, 6);
    entry.writeUInt16LE(0x0800, 8);
    entry.writeUInt16LE(method, 10);
    entry.writeUInt16LE(dosTime, 12);
    entry.writeUInt16LE(dosDate, 14);
    entry.writeUInt32LE(crc, 16);
    entry.writeUInt32LE(body.length, 20);
    entry.writeUInt32LE(data.length, 24);
    entry.writeUInt16LE(nameBuf.length, 28);
    entry.writeUInt32LE(((0o100000 | mode) << 16) >>> 0, 38); // Unix mode in the high 16 bits
    entry.writeUInt32LE(offset, 42);
    central.push(entry, nameBuf);

    offset += local.length + nameBuf.length + body.length;
  }

  const centralSize = central.reduce((sum, buf) => sum + buf.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, ...central, end]);
}

if (entries.length > 65535) fail("Too many files for a plain zip.");
mkdirSync(join(root, "dist"), { recursive: true });
const zip = buildZip(entries);
writeFileSync(outFile, zip);

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
const raw = entries.reduce((sum, e) => sum + e.data.length, 0);
console.log(`\n✓ ${outFile}`);
console.log(`  ${entries.length} files, ${mb(zip.length)} MB zipped (${mb(raw)} MB unpacked), ${mb(statSync(outFile).size)} MB on disk`);
