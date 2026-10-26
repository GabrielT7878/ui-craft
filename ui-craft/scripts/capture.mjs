// Screenshots em vários tamanhos de tela + checagem automática de layout.
// Uso: node capture.mjs <url> [--out dir] [--viewports mobile-s,mobile,tablet,laptop,desktop]
//                              [--dark] [--reduced-motion] [--flow arquivo.mjs] [--wait seletor]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, contextOptions, loadFlow, VIEWPORTS } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const url = args._[0];
if (!url) {
  console.error('Uso: node capture.mjs <url> [--out dir] [--viewports a,b] [--dark] [--flow f.mjs]');
  process.exit(1);
}
const outDir = path.resolve(args.out || 'ui-check');
const names = (args.viewports || 'mobile-s,mobile,tablet,laptop,desktop').split(',');
const flow = await loadFlow(args.flow);
await fs.mkdir(outDir, { recursive: true });

// Roda dentro da página. Retorna problemas de layout.
function inspectLayout(checkTouch) {
  const vw = document.documentElement.clientWidth;
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    if (cls) s += `.${cls}`;
    const text = (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40);
    return text ? `${s} "${text}"` : s;
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none' && st.opacity !== '0';
  };
  const all = [...document.body.querySelectorAll('*')].filter(visible);
  const issues = [];

  // Overflow horizontal: só os elementos mais profundos que vazam.
  if (document.documentElement.scrollWidth > vw + 1) {
    issues.push({ type: 'horizontal-overflow', detail: `scrollWidth ${document.documentElement.scrollWidth} > viewport ${vw}` });
  }
  const leaking = all.filter((el) => {
    const r = el.getBoundingClientRect();
    return r.right > vw + 1 || r.left < -1;
  }).filter((el, _, arr) => !arr.some((o) => o !== el && el.contains(o)));
  for (const el of leaking.slice(0, 10)) {
    const r = el.getBoundingClientRect();
    issues.push({ type: 'element-outside-viewport', el: describe(el), rect: [Math.round(r.left), Math.round(r.right)] });
  }

  // Texto cortado sem reticências.
  for (const el of all) {
    const st = getComputedStyle(el);
    const clips = ['hidden', 'clip'].includes(st.overflowX) || ['hidden', 'clip'].includes(st.overflowY);
    if (!clips || st.textOverflow === 'ellipsis' || parseInt(st.webkitLineClamp) > 0) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
      issues.push({ type: 'clipped-text', el: describe(el) });
    }
  }

  // Interativos: sobreposição e tamanho do alvo.
  const interactive = all.filter((el) => el.matches(
    'a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=link],[role=tab],[role=menuitem],[role=checkbox],[role=switch],[tabindex]:not([tabindex="-1"])'
  )).slice(0, 400);
  const rects = interactive.map((el) => el.getBoundingClientRect());
  for (let i = 0; i < interactive.length; i++) {
    for (let j = i + 1; j < interactive.length; j++) {
      const a = interactive[i], b = interactive[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = rects[i], rb = rects[j];
      const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (w > 2 && h > 2) issues.push({ type: 'overlapping-interactive', el: describe(a), with: describe(b) });
    }
  }
  if (checkTouch) {
    interactive.forEach((el, i) => {
      const r = rects[i];
      if (el.matches('input[type=checkbox],input[type=radio]') && el.closest('label')) return;
      if (r.width < 44 || r.height < 44) {
        issues.push({ type: 'small-touch-target', el: describe(el), size: [Math.round(r.width), Math.round(r.height)] });
      }
    });
  }

  for (const img of document.images) {
    if (img.complete && img.naturalWidth === 0) issues.push({ type: 'broken-image', el: img.currentSrc || img.src });
  }
  return issues;
}

const browser = await chromium.launch();
const report = { url, theme: args.dark ? 'dark' : 'light', viewports: {} };

for (const name of names) {
  const context = await browser.newContext({
    ...contextOptions(name),
    colorScheme: args.dark ? 'dark' : 'light',
    reducedMotion: args['reduced-motion'] ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(e.message));

  await page.goto(url, { waitUntil: 'networkidle' });
  if (args.wait) await page.waitForSelector(args.wait);
  if (flow) await flow(page);
  await page.waitForTimeout(600); // animações de entrada terminam

  const base = path.join(outDir, name);
  await page.screenshot({ path: `${base}.png` });
  await page.screenshot({ path: `${base}-full.png`, fullPage: true });

  const issues = await page.evaluate(inspectLayout, VIEWPORTS[name].mobile);
  report.viewports[name] = { size: `${VIEWPORTS[name].width}x${VIEWPORTS[name].height}`, issues, consoleErrors };
  await context.close();
}
await browser.close();

await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

let total = 0;
for (const [name, r] of Object.entries(report.viewports)) {
  const counts = {};
  for (const i of r.issues) counts[i.type] = (counts[i.type] || 0) + 1;
  total += r.issues.length + r.consoleErrors.length;
  const summary = Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(', ') || 'ok';
  console.log(`${name.padEnd(9)} ${r.size.padEnd(10)} ${summary}${r.consoleErrors.length ? ` | console errors: ${r.consoleErrors.length}` : ''}`);
}
console.log(`\nScreenshots e report.json em ${outDir}`);
process.exit(total ? 2 : 0);
