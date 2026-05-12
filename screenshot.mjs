import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

let n = 1;
while (fs.existsSync(path.join(dir, `screenshot-${n}${label}.png`))) n++;
const out = path.join(dir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
// Force all animations/transitions to complete instantly so everything is visible
await page.evaluate(() => {
  const s = document.createElement('style');
  s.textContent = '*, *::before, *::after { animation-duration: 0.001s !important; animation-delay: 0s !important; transition-duration: 0.001s !important; transition-delay: 0s !important; }';
  document.head.appendChild(s);
  document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
  const map = {s1:'9.1×', s2:'12,400+', s3:'120+', s4:'30 days'};
  Object.entries(map).forEach(([id, val]) => { const el=document.getElementById(id); if(el) el.textContent=val; });
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`Saved: ${out}`);
