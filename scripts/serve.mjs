/**
 * Zero-dependency static server for the production build in ./out
 * Usage: node scripts/serve.mjs   (then open http://localhost:3000)
 * Hardened: any request error returns 404/500 instead of stopping the server; errors go to scripts/serve.log
 */
import { createServer } from "node:http";
import { appendFile, readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../out/", import.meta.url)); // handles spaces in folder names
const LOG = fileURLToPath(new URL("./serve.log", import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".pdf": "application/pdf", ".xml": "application/xml",
};

const log = (msg) => appendFile(LOG, `[${new Date().toISOString()}] ${msg}\n`).catch(() => {});
process.on("uncaughtException", (e) => log(`uncaughtException: ${e?.stack || e}`));
process.on("unhandledRejection", (e) => log(`unhandledRejection: ${e?.stack || e}`));

async function resolve(urlPath) {
  let decoded;
  try { decoded = decodeURIComponent((urlPath || "/").split("?")[0]); } catch { return null; }
  const file = join(ROOT, normalize(decoded));
  if (!file.startsWith(ROOT.replace(/[\\/]$/, "") + sep) && file !== ROOT) return null; // no path traversal
  try {
    const s = await stat(file);
    return s.isDirectory() ? join(file, "index.html") : file;
  } catch {
    try { await stat(file + ".html"); return file + ".html"; } catch { /* fall through */ }
    // Router prefetch: "dir/__next.a.b.__PAGE__.txt" is exported as "dir/__next.a/b/__PAGE__.txt"
    const m = file.match(/^(.*[\\/])__next\.(.+)\.txt$/);
    if (m) {
      const [first, ...rest] = m[2].split(".");
      const seg = join(m[1], `__next.${first}`, ...rest) + ".txt";
      try { await stat(seg); return seg; } catch { /* not exported */ }
    }
    return null;
  }
}

const server = createServer(async (req, res) => {
  try {
    const file = await resolve(req.url);
    const body = file ? await readFile(file).catch(() => null) : null;
    if (body) {
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
      res.end(body);
      return;
    }
    const page = await readFile(join(ROOT, "404.html")).catch(() => Buffer.from("Not found"));
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(page);
  } catch (e) {
    log(`request ${req.url}: ${e?.stack || e}`);
    if (!res.headersSent) res.writeHead(500);
    res.end("Server error");
  }
});
server.on("error", (e) => { log(`server error: ${e?.stack || e}`); process.exit(1); });
server.listen(PORT, "0.0.0.0", () => {
  const lan = Object.values(networkInterfaces()).flat().find((i) => i && i.family === "IPv4" && !i.internal)?.address;
  log(`started on ${PORT}`);
  console.log(`\n  Synthokem website is running:\n  → This computer:      http://localhost:${PORT}\n${lan ? `  → Same Wi-Fi devices: http://${lan}:${PORT}\n` : ""}\n  Keep this window open. Press Ctrl+C to stop.\n`);
});
