import functions from "firebase-functions";
// import puppeteer from "puppeteer";
import chromium from "chrome-aws-lambda";

export const sharePic = functions
  .runWith({ memory: "2GB" })
  .https.onRequest(async (req, res) => {
    const queryString = req.url.split("?")[1];

    // const browser = await puppeteer.launch({
    //   headless: true,
    //   args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // });

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });
    await page.goto(
      `file://${process.cwd()}/static/index.html?${queryString}`,
      {
        waitUntil: "networkidle0",
      }
    );
    const map = await page.$("#map");

    res.setHeader("Content-Disposition", "attachment; filename=share_me.png");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).end(await map.screenshot(), "binary");
  });
