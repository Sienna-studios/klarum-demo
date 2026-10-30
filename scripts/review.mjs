// npm run review: builds once, serves the production build, then runs every measuring tool for both pages
// and writes everything to screenshots/review/<ROUND>/{dark,light}/ plus REPORT.md.
//   ROUND=round-1 npm run review      (default round-0)
//   PAGES=dark npm run review         (one page only)
import { spawn, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { PAGES, PORT, ROOT, ROUND, outDir, pageKeys, sh } from "./lib/review.mjs";

const base = `http://localhost:${PORT}`;
const env = { ...process.env, BASE_URL: base };
const tools = ["token-audit", "overlay", "squint", "shots", "stress", "census", "photo-contrast", "lighthouse"];

try { await fetch(base); throw new Error(`port ${PORT} is already serving something; stop it or set REVIEW_PORT`); } catch (e) { if (/already serving/.test(e.message)) throw e; }
sh("npm", ["run", "build"]);
const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore", detached: true });
const read = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : null);

try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch {} await sleep(500); }
  for (const t of tools) {
    if (t === "photo-contrast") spawnSync("node", [`scripts/${t}.mjs`], { cwd: ROOT, env, stdio: "inherit" }); // a failing ratio is a finding, not a crash
    else sh("node", [`scripts/${t}.mjs`], { env });
  }

  // Playwright's own HAR + budget test (mobile, cold) and the existing axe test, run unchanged
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const dir = outDir(key, "network");
    const run = spawnSync("npx", ["playwright", "test", "network", "-g", "HAR|budget", "--project=mobile-390", "--reporter=list"],
      { cwd: ROOT, env: { ...env, BASE_URL: base + cfg.path }, encoding: "utf8" });
    const log = run.stdout + run.stderr;
    writeFileSync(join(dir, "playwright-network.log"), log);
    const m = log.match(/before load: ([\d.]+) KB over (\d+) requests/);
    const har = readdirSync(join(ROOT, "test-results"), { recursive: true }).find((f) => String(f).endsWith("before-interaction.har"));
    if (har) cpSync(join(ROOT, "test-results", String(har)), join(dir, "before-interaction.har"));
    const out = { page: cfg.path, kbBeforeLoad: m ? +m[1] : null, requestsBeforeLoad: m ? +m[2] : null, passed: run.status === 0 };
    writeFileSync(join(dir, "network.json"), JSON.stringify(out, null, 1));
    console.log(`[network] ${key} ${cfg.path}: ${out.kbBeforeLoad} KB, ${out.requestsBeforeLoad} requests before load; HAR + budget tests ${out.passed ? "pass" : "FAIL"}`);
  }
  if (pageKeys().includes("dark")) {
    const run = spawnSync("npx", ["playwright", "test", "a11y", "--project=desktop-1280", "--reporter=list"], { cwd: ROOT, env, encoding: "utf8" });
    writeFileSync(join(outDir("dark", "axe"), "playwright-a11y.log"), run.stdout + run.stderr);
    console.log(`[axe] existing a11y spec on / (desktop-1280): ${run.status === 0 ? "pass" : "FAIL"}`);
    // keyboard interaction tests for the three moments, plus the smoke checks, both projects
    const it = spawnSync("npx", ["playwright", "test", "moments", "smoke", "--project=mobile-390", "--project=desktop-1280", "--reporter=list"], { cwd: ROOT, env, encoding: "utf8" });
    writeFileSync(join(outDir("dark", "axe"), "playwright-interaction.log"), it.stdout + it.stderr);
    console.log(`[interaction] moments + smoke: ${it.status === 0 ? "pass" : "FAIL"}`);
  }
} finally {
  try { process.kill(-server.pid); } catch {}
  rmSync(join(ROOT, "test-results"), { recursive: true, force: true });
}

// REPORT.md
const lines = [`# Review ${ROUND}`, ""];
for (const key of pageKeys()) {
  const cfg = PAGES[key];
  const d = (f) => read(join(ROOT, "screenshots/review", ROUND, key, f));
  const ct = d("contrast/photo-contrast.json"), audit = d("token-audit.json"), ov = d("overlay/overlay.json"), st = d("stress/stress.json"), lh = d("lighthouse/lighthouse.json"), cn = d("census/census.json"), net = d("network/network.json");
  lines.push(`## ${key}: ${cfg.path}`, "");
  if (audit) lines.push(`- Off-token values: ${audit.summary.distinctValues} distinct (${audit.summary.uses} uses). Top: ${audit.summary.top.slice(0, 3).map((v) => `${v.kind} ${v.value} x${v.uses}`).join("; ")}`);
  if (ov) { const s = ov[cfg.primaryTheme]; lines.push(`- Overlay vs Brief: build ${s.buildSize.join("x")}, target ${s.targetSize.join("x")}; pixel mismatch ${s.firstScreenMismatchPct}% first screen, ${s.fullMismatchPct}% full page`); }
  if (st) lines.push(`- Stress: ${st.results.map((r) => `${r.config} o${r.counts.overflow}/c${r.counts.clip}/v${r.counts.overlap}`).join(", ")} (o overflow, c clip, v overlap)`);
  if (st) lines.push(`- Axe (stress, serious+critical): ${st.results.reduce((n, r) => n + r.axe.blocking.length, 0)} across ${st.results.length} configs`);
  if (ct) lines.push(`- Contrast over photos: worst ${Math.min(...ct.results.filter((r) => r.worst).map((r) => r.worst.ratio))}:1 (min ${ct.min}); failing text boxes: ${ct.results.reduce((n, r) => n + r.failing.length, 0)}`);
  if (lh) lines.push(`- Lighthouse mobile median of ${lh.runs}: perf ${lh.median.performance}, LCP ${lh.median.lcpMs} ms, TBT ${lh.median.tbtMs} ms, CLS ${lh.median.cls}; budget ${lh.budgetAssertions.passed ? "pass" : "FAIL"}`);
  if (cn) { const r = cn.results[cn.primaryTheme]; lines.push(`- Census (${cn.primaryTheme}): red ${r.red.total} (${cn.meanings.map((m) => `${m} ${r.red.byMeaning[m] || 0}`).join(", ")}); decorative ${r.deco.total}`); }
  if (net) lines.push(`- Before load (mobile, cold): ${net.kbBeforeLoad} KB, ${net.requestsBeforeLoad} requests; HAR + budget tests ${net.passed ? "pass" : "FAIL"}`);
  lines.push("");
}
writeFileSync(join(ROOT, "screenshots/review", ROUND, "REPORT.md"), lines.join("\n"));
console.log(`\nDone: screenshots/review/${ROUND}/REPORT.md`);
