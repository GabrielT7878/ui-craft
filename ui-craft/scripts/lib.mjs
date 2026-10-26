import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const VIEWPORTS = {
  'mobile-s': { width: 320, height: 568, mobile: true },
  mobile: { width: 390, height: 844, mobile: true },
  tablet: { width: 768, height: 1024, mobile: true },
  laptop: { width: 1280, height: 800, mobile: false },
  desktop: { width: 1920, height: 1080, mobile: false },
  tv: { width: 1920, height: 1080, mobile: false },
};

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { args._.push(a); continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}

export function contextOptions(name) {
  const vp = VIEWPORTS[name];
  if (!vp) throw new Error(`Viewport desconhecido: ${name}. Use: ${Object.keys(VIEWPORTS).join(', ')}`);
  return {
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  };
}

export async function loadFlow(flowPath) {
  if (!flowPath) return null;
  const mod = await import(pathToFileURL(path.resolve(flowPath)).href);
  return mod.default;
}
