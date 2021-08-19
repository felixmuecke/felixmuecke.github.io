import functions from "firebase-functions";
import puppeteer from "puppeteer";

export const sharePic = functions
  .runWith({ memory: "1GB" })
  .https.onRequest(async (req, res) => {
    const queryString = req.url.split("?")[1];
    console.log(queryString);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(
      `file://${process.cwd()}/static/index.html?${queryString}`,
      {
        waitUntil: "networkidle0",
      }
    );
    const map = await page.$("#map");

    res.setHeader("Content-Disposition", "attachment; filename=share.png");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).end(await map.screenshot(), "binary");
  });
