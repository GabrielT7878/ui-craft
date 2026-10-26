// Grava em vídeo um fluxo da UI.
// Uso: node record.mjs <url> [--flow arquivo.mjs] [--viewport mobile] [--out video.webm] [--dark]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, contextOptions, loadFlow } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const url = args._[0];
if (!url) {
  console.error('Uso: node record.mjs <url> [--flow f.mjs] [--viewport nome] [--out video.webm]');
  process.exit(1);
}
const viewportName = args.viewport || 'laptop';
const out = path.resolve(args.out || `ui-check/${viewportName}.webm`);
const flow = await loadFlow(args.flow);
await fs.mkdir(path.dirname(out), { recursive: true });

// Passeio padrão: rolagem lenta e Tab pelos primeiros elementos focáveis.
async function defaultFlow(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= height; y += 120) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(500);
  await page.evaluate(() => scrollTo({ top: 0 }));
  await page.waitForTimeout(500);
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(350);
  }
}

const options = contextOptions(viewportName);
const browser = await chromium.launch();
const context = await browser.newContext({
  ...options,
  colorScheme: args.dark ? 'dark' : 'light',
  recordVideo: { dir: path.dirname(out), size: options.viewport },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await (flow || defaultFlow)(page);
await page.waitForTimeout(800);

const video = page.video();
await context.close();
await browser.close();
await fs.rename(await video.path(), out);
console.log(`Vídeo salvo em ${out}`);
