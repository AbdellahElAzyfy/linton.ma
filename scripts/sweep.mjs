// Responsive screenshot sweep: every page × locale × theme × viewport.
//
//   npm run dev            (in another terminal)
//   npm run sweep          (all pages)
//   npm run sweep -- /about --theme=dark --lang=en
//
// Each page is scrolled to the bottom first so every reveal-on-scroll block
// has fired, then captured full-page into screenshots/. Also reports any
// horizontal overflow, which is the most common breakpoint bug.
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.SWEEP_BASE ?? "http://localhost:3000";
const WIDTHS = [1920, 1536, 1366, 1152, 1100, 976, 900, 736, 600, 414, 320];
// Just either side of the CSS breakpoints (72rem, 61rem, 46rem at 16px).
const EDGE_WIDTHS = [1153, 1151, 977, 975, 737, 735];
const PAGES = ["", "/about", "/contact", "/legal", "/does-not-exist"];

const args = process.argv.slice(2);
const flag = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1];
const pages = args.filter((arg) => arg.startsWith("/")).map((p) => (p === "/" ? "" : p));
const langs = flag("lang") ? [flag("lang")] : ["fr", "en"];
const themes = flag("theme") ? [flag("theme")] : ["light", "dark"];
const widths = flag("widths") === "edges" ? EDGE_WIDTHS : flag("widths") === "all" ? [...WIDTHS, ...EDGE_WIDTHS] : WIDTHS;

await mkdir("screenshots", { recursive: true });
const browser = await chromium.launch();
const problems = [];

for (const theme of themes) {
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  await context.addInitScript((value) => localStorage.setItem("linton-theme", value), theme);
  const page = await context.newPage();

  for (const lang of langs) {
    for (const path of pages.length ? pages : PAGES) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${BASE}/${lang}${path}`, { waitUntil: "networkidle" });

        // MotionReady adds this class from an effect, i.e. once hydrated —
        // scrolling earlier (easy in dev mode) leaves the reveals unobserved.
        await page.waitForFunction(() => document.documentElement.classList.contains("motion-ready"), null, {
          timeout: 15000,
        });
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 400) {
            window.scrollTo({ top: y, behavior: "instant" });
            await new Promise((resolve) => setTimeout(resolve, 60));
          }
          window.scrollTo({ top: 0, behavior: "instant" });
        });
        const hidden = await page.evaluate(() => document.querySelectorAll(".reveal:not(.is-visible)").length);
        if (hidden) problems.push(`${lang}${path || "/"} @${width} ${theme}: ${hidden} reveal blocks never became visible`);
        await page.waitForTimeout(700);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 0) problems.push(`${lang}${path || "/"} @${width} ${theme}: ${overflow}px horizontal overflow`);

        const name = `${lang}${path.replaceAll("/", "_") || "_home"}-${theme}-${width}.png`;
        await page.screenshot({ path: `screenshots/${name}`, fullPage: true });
        process.stdout.write(".");
      }
    }
  }
  await context.close();
}

await browser.close();
console.log(`\n${problems.length ? problems.join("\n") : "No horizontal overflow."}`);
