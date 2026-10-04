import fs from 'node:fs';
import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  args: ['--no-sandbox'],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  let svg = fs
    .readFileSync('public/images/social-preview.svg', 'utf8')
    .replace('EFIops · Websites', 'Websites')
    .replaceAll('Arial,sans-serif', 'Lato,Arial,sans-serif');
  const font = fs
    .readFileSync('node_modules/@fontsource/lato/files/lato-latin-700-normal.woff2')
    .toString('base64');
  const logo = fs.readFileSync('public/images/efiops-logo-current.png').toString('base64');
  await page.setContent(
    `<style>@font-face{font-family:Lato;src:url(data:font/woff2;base64,${font});font-weight:400 700}body{margin:0}svg{display:block}.logo{position:absolute;top:24px;left:70px;width:165px;background:white;padding:8px 15px;border-radius:5px;box-sizing:border-box}</style>${svg}<img class="logo" src="data:image/png;base64,${logo}" alt="EFIops">`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/images/social-preview.png' });
  console.log('Generated 1200 × 630 social image with the unchanged supplied logo.');
} finally {
  await browser.close();
}
