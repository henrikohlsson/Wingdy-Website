import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
await page.addStyleTag({ content: '*,*::before,*::after{animation-duration:.001s!important;animation-delay:0s!important;transition-duration:.001s!important;transition-delay:0s!important}' });
await page.evaluate(() => {
  document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
  const map = {s1:'9.1×', s2:'12,400+', s3:'120+', s4:'30 days'};
  Object.entries(map).forEach(([id, val]) => { const el=document.getElementById(id); if(el) el.textContent=val; });
});
await new Promise(r => setTimeout(r, 500));

const clips = [
  { name: '4-services',     y: 1700, h: 1100 },
  { name: '5-results',      y: 2900, h: 900  },
  { name: '6-process',      y: 3900, h: 900  },
  { name: '7-testimonials', y: 4900, h: 900  },
  { name: '8-cta',          y: 5900, h: 900  },
];

for (const c of clips) {
  await page.screenshot({ path: `./temporary screenshots/screenshot-${c.name}.png`, clip: { x:0, y:c.y, width:1440, height:c.h } });
  console.log(`Saved ${c.name}`);
}
await browser.close();
