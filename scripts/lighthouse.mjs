// Lighthouse (mobile, 3 runs, median) per page, using the settings and budget in lighthouserc.json.
// Raw reports go to <page>/lighthouse/; lighthouse.json holds the medians and the assertion result.
// Run: npm run review:lighthouse
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PAGES, ROOT, main, median, outDir, pageKeys } from "./lib/review.mjs";

const CHROME = ["/opt/pw-browsers/chromium", "/opt/pw-browsers/chromium-1243/chrome-linux64"].find((d) => existsSync(join(d, "chrome")));
const env = { ...process.env, ...(CHROME && !process.env.CHROME_PATH ? { CHROME_PATH: join(CHROME, "chrome") } : {}) };
const lhci = (args) => spawnSync("npx", ["lhci", ...args], { cwd: ROOT, env, encoding: "utf8" });

main(async (base) => {
  const rc = JSON.parse(readFileSync(join(ROOT, "lighthouserc.json"), "utf8"));
  delete rc.ci.collect.startServerCommand; // the review runner already serves the production build
  delete rc.ci.collect.startServerReadyPattern;
  for (const key of pageKeys()) {
    const cfg = PAGES[key];
    const dir = outDir(key, "lighthouse");
    rmSync(join(ROOT, ".lighthouseci"), { recursive: true, force: true });
    for (const f of readdirSync(dir)) if (/^lhr-.*\.json$/.test(f)) rmSync(join(dir, f)); // keep only this run's reports
    const conf = join(dir, "lighthouserc.used.json");
    rc.ci.collect.url = [base + cfg.path];
    writeFileSync(conf, JSON.stringify(rc, null, 1));
    const c = lhci(["collect", `--config=${conf}`]);
    if (c.status !== 0) throw new Error(`lhci collect failed:\n${c.stdout}\n${c.stderr}`);
    const a = lhci(["assert", `--config=${conf}`]);
    const lhrs = readdirSync(join(ROOT, ".lighthouseci")).filter((f) => /^lhr-.*\.json$/.test(f));
    mkdirSync(dir, { recursive: true });
    const runs = lhrs.map((f) => { cpSync(join(ROOT, ".lighthouseci", f), join(dir, f)); return JSON.parse(readFileSync(join(ROOT, ".lighthouseci", f), "utf8")); });
    const m = (fn) => median(runs.map(fn));
    const au = (r, id) => r.audits[id].numericValue;
    const out = {
      page: cfg.path, runs: runs.length, formFactor: runs[0].configSettings.formFactor, throttling: runs[0].configSettings.throttlingMethod,
      median: {
        performance: m((r) => Math.round(r.categories.performance.score * 100)),
        lcpMs: Math.round(m((r) => au(r, "largest-contentful-paint"))),
        tbtMs: Math.round(m((r) => au(r, "total-blocking-time"))),
        cls: +m((r) => au(r, "cumulative-layout-shift")).toFixed(3),
        fcpMs: Math.round(m((r) => au(r, "first-contentful-paint"))),
        transferKB: +(m((r) => r.audits["total-byte-weight"].numericValue) / 1024).toFixed(1),
        requests: m((r) => r.audits["network-requests"].details.items.length),
      },
      budgetAssertions: { passed: a.status === 0, output: (a.stdout + a.stderr).trim().split("\n").slice(-14) },
    };
    writeFileSync(join(dir, "lighthouse.json"), JSON.stringify(out, null, 1));
    const x = out.median;
    console.log(`[lighthouse] ${key} ${cfg.path}: perf ${x.performance}, LCP ${x.lcpMs} ms, TBT ${x.tbtMs} ms, CLS ${x.cls}, ${x.transferKB} KB over ${x.requests} requests (Lighthouse, median of ${runs.length}); budget ${out.budgetAssertions.passed ? "pass" : "FAIL"}`);
  }
  rmSync(join(ROOT, ".lighthouseci"), { recursive: true, force: true });
});
