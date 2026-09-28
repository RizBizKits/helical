const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = "http://127.0.0.1:43127";
const OUT = path.join(__dirname, "..", "screenshots");

function localDateOffset(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const populatedStore = {
  version: 1,
  habits: [
    {
      id: "h-water",
      name: "Drink water",
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
      id: "h-walk",
      name: "Evening walk",
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    },
    {
      id: "h-read",
      name: "Read 10 pages",
      createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    },
  ],
  completions: [
    { habitId: "h-water", date: localDateOffset(6) },
    { habitId: "h-water", date: localDateOffset(5) },
    { habitId: "h-water", date: localDateOffset(4) },
    { habitId: "h-water", date: localDateOffset(2) },
    { habitId: "h-water", date: localDateOffset(1) },
    { habitId: "h-water", date: localDateOffset(0) },
    { habitId: "h-walk", date: localDateOffset(5) },
    { habitId: "h-walk", date: localDateOffset(3) },
    { habitId: "h-walk", date: localDateOffset(1) },
    { habitId: "h-walk", date: localDateOffset(0) },
    { habitId: "h-read", date: localDateOffset(4) },
    { habitId: "h-read", date: localDateOffset(2) },
    { habitId: "h-read", date: localDateOffset(0) },
  ],
};

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  // let climb stats / paints settle
  await page.waitForTimeout(600);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  // Empty desktop
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("helical.habits.v1"));
    await page.reload({ waitUntil: "networkidle" });
    await settle(page);
    await page.screenshot({
      path: path.join(OUT, "empty-state.png"),
      fullPage: false,
    });
    await context.close();
  }

  // Populated desktop
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate((store) => {
      localStorage.setItem("helical.habits.v1", JSON.stringify(store));
    }, populatedStore);
    await page.reload({ waitUntil: "networkidle" });
    await settle(page);
    await page.screenshot({
      path: path.join(OUT, "populated-week.png"),
      fullPage: false,
    });
    await context.close();
  }

  // Mobile populated — tall enough to show climb + habits
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 1100 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate((store) => {
      localStorage.setItem("helical.habits.v1", JSON.stringify(store));
    }, populatedStore);
    await page.reload({ waitUntil: "networkidle" });
    await settle(page);
    await page.screenshot({
      path: path.join(OUT, "mobile-layout.png"),
      fullPage: true,
    });
    await context.close();
  }

  await browser.close();
  for (const f of ["empty-state.png", "populated-week.png", "mobile-layout.png"]) {
    const p = path.join(OUT, f);
    console.log(f, fs.statSync(p).size);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
