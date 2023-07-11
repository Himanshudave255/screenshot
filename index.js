const puppeteer = require('puppeteer');

(async () => {
  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();
  
  // await page.setDefaultNavigationTimeout(60000);

  // Set viewport width and height
  await page.setViewport({ width: 1080, height: 1500 });

  const website_url = 'http://localhost:3000/apphealer/dashboards/screenshot';

  // Open URL in current page
  await page.goto(website_url, { waitUntil: 'networkidle0', timeout: 0 });
  const selector = '#screenshot';
  await page.waitForSelector(selector);
  const element = await page.$(selector);

  // Capture screenshot
  await element.screenshot({
    path: 'screenshot.jpg',
    fullPage: false 
  });

  // Close the browser instance
  await browser.close();
})();