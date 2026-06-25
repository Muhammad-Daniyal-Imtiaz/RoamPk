const fs = require("fs");
const path = require("path");

const dstDir = path.join(__dirname, "..", ".open-next", "server-functions", "default", "node_modules", "@libsql", "client");

// Copy missing web.js/hrana.js files that workerd condition needs but Next.js trace skips
const srcDir = path.join(__dirname, "..", "node_modules", "@libsql", "client");

function copyMissing(srcBase, dstBase, relative) {
  const src = path.join(srcBase, relative);
  const dst = path.join(dstBase, relative);
  if (fs.existsSync(src) && !fs.existsSync(dst)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log(`[PATCH] Added ${relative}`);
  }
}

const neededFiles = [
  "lib-esm/web.js", "lib-esm/web.d.ts",
  "lib-esm/hrana.js", "lib-esm/hrana.d.ts",
  "lib-esm/ws.js", "lib-esm/ws.d.ts",
];

for (const file of neededFiles) {
  copyMissing(srcDir, dstDir, file);
}

console.log("[PATCH] libsql patch complete");
