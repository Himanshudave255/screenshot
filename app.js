const express = require("express");
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
var cors = require('cors');
// var request = require('request');
var axios = require('axios');
const app = express();

function base64_encode(file) {
  return "data:image/jpg;base64," + fs.readFileSync(file, 'base64');
}

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/screenshot", (req, res) => {
  const events = req.body.events;
  res.send('Data Received: ' + JSON.stringify(req.body));
  console.log('><', JSON.stringify(req.body));
  // here we will make the api call for data insertion innto backend
  (async () => {
    // Create a browser instance
    const browser = await puppeteer.launch();
  
    // Create a new page
    const page = await browser.newPage();
  
    // Set viewport width and height
    await page.setViewport({ width: 1920, height: 1080 });
  
    const website_url = 'http://localhost:3000/apphealer/dashboards/screenshot';
  
    // Open URL in current page
    await page.goto(website_url, { waitUntil: 'networkidle0' });
    // await page.$eval('input[name=userid]', el => el.value = 'HB_E1_Admin_User');
    // await page.$eval('input[name=pwd]', el => el.value = 'P@$$W0rd');
    // await page.click('button.btn.btn-block.btn-fluid');
    // await page.waitForTimeout(4000);
    // await page.goto(website_url, { waitUntil: 'networkidle0', timeout: 0 }); 
    
    setTimeout(async () => {
      const selector = '#screenshot';
      await page.waitForSelector(selector);
      const element = await page.$(selector);

      // get html content out
      // const html = await page.$eval('#screenshot', el => el.outerHTML);
      // const html = await page.content();
      // console.log('html>><', html);

      // Capture screenshot
      await element.screenshot({
        path: 'screenshot.png',
        fullPage: false 
      });

      // await page.pdf({
      //   path: 'result.pdf',
      //   printBackground: false,
      //   format: 'A4',
      // });

      // base 64 conversion
      const base64str = base64_encode('screenshot.png');

      //trigger email
      axios.post("https://apphealer-dev.aexp.com/notification/notify", {
        from: "apphealer.notification-dev@aexp.com",
        to: ["Himanshu.Dave@aexp.com"],
        subject: "App-Healer Reports",
        text: "this is testing mail - 5.",
        html: `<!DOCTYPE html><html><body><img src=${base64str} width='1000' alt='report'></body></html>`
      }, {
        headers: {
            'Content-Type': 'application/json',
            'notifyOn': 'email',
        }}).then(function(response) {
        console.log('response', response.data)
      }).catch(function(error) {
        console.log('error', error)
      });

      // Close the browser instance
      await browser.close();
    }, 2000);
  })();
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
