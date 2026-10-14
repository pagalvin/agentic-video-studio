import puppeteer from 'puppeteer';

const url = process.argv[2] ?? 'http://localhost:3000';
const browser = await puppeteer.launch({
  ...(process.env.PUPPETEER_EXECUTABLE_PATH
    ? {executablePath: process.env.PUPPETEER_EXECUTABLE_PATH}
    : {}),
});
try {
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});
  const title = await page.title();
  console.log(`Browser reached ${url}; title: ${title}`);
} finally {
  await browser.close();
}
