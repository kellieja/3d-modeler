// Launches Chromium through Playwright. Uses a local `npm i -D playwright`
// install when present, otherwise the copy preinstalled in the build sandbox.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export async function launch() {
  let chromium;
  try { ({ chromium } = require("playwright")); }
  catch { ({ chromium } = require("/opt/node-tools/node_modules/playwright")); }
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  return chromium.launch({ proxy });
}
