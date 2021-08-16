import functions from "firebase-functions";
import puppeteer from "puppeteer";

export const sharePic = functions
  .runWith({ memory: "1GB" })
  .https.onRequest(async (req, res) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(`file://${process.cwd()}/static/index.html`, {
      waitUntil: "networkidle0",
    });
    const element = await page.$("#map");

    res.setHeader("Content-Disposition", "attachment; filename=share.png");
    res.status(200).end(await element.screenshot(), "binary");
  });
