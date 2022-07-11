const puppeteer = require("puppeteer");
const jimp = require("jimp");
const projectConfig = require("../project.config.json");
const fs = require("fs-extra");
const path = require("path");

const destinationPath = "public/fallbacks";
const slug = projectConfig.project.slug;
const queryStringVar = projectConfig.project.queryStringVar; 
const url = "http://localhost:3000/";

const fallbacks = [
  { name: "apple", width: 375 },
  { name: "fallback", width: 600 },
  { name: "social", width: 800, height: 450 },
];

const slugifyItem = (str) => {
  let outString = str.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').replace(' ', '')
  return outString; 
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const takeScreenshot = async (size, local) => {
  let browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.setCacheEnabled(false);

  // Waits to make sure the server is spun up. You can increase this if necessary.
  await sleep(4000);

  await page.goto(url + `?${queryStringVar}=${local}`, { waitUntil: "networkidle0" });

  await page.waitForSelector(".chart-container");

  // Constrain width and adjust height to fit everything in .chart-container
  await page.setViewport({
    width: size.width,
    height: 800, // arbitrary, will be reset below
  });
  const example = await page.$(".chart-container");
  const chartContainerSize = await example.boundingBox();
  await page.setViewport({
    width: size.width,
    height: parseInt(chartContainerSize.height),
    deviceScaleFactor: 2, // retina
  });

  await page.evaluate(() => {
    const ignore = document.querySelectorAll(".dropdown");
    ignore.forEach((el) => {
      el.style.appearance = "none";
      el.style.border = "0 !important"
    });
  });

  // Capture all of .chart-container
  const clip = {
    x: chartContainerSize.x,
    y: chartContainerSize.y,
    width: chartContainerSize.width,
    height: chartContainerSize.height,
  };

  await sleep(2000);

  // Take the shot
  await page.screenshot({
    path: `${destinationPath}/${slug}-${slugifyItem(local)}-${size.name}.png`,
    type: "png",
    clip,
  });
  await page.close();
  await browser.close();

  return size;
};

const resizeSocial = async (dms, local) => {
  const imageToResize = await jimp.read(
    `${destinationPath}/${slug}-${slugifyItem(local)}-social.png`
  );
  imageToResize
    .background(0xffffffff)
    .contain(dms.width * 2, dms.height * 2) // contain within these dimensions
    .write(`${destinationPath}/${slug}-${slugifyItem(local)}-social.png`);
};

const init = async (local) => {
  fs.emptyDirSync(path.join(destinationPath, `${slugifyItem(local)}`)); // remove existing fallbacks

  try {
    const results = await Promise.all(
      fallbacks.map((size) => takeScreenshot(size, local))
    );
  } catch {
    console.error(
      "Unable to connect at http://0.0.0.0:3000/. 🚨 Make sure you have gulp serve running. 🚨"
    );
  }

  await resizeSocial(fallbacks.filter((d) => d.name === "social")[0], local);
  console.log("fallbacks created ✨");
};

const createFolder = async (local) => {
  fs.mkdir(path.join(destinationPath, `${slugifyItem(local)}`), (err) => {
    if (err.code !== "EEXISTS") {
        return console.error(err);
    }
    console.log(`Directory ${slugifyItem(local)} created`);
  })
}

const moveFiles = async (local) => {
  fs.readdir(destinationPath, (err, files) => {
    files.forEach(file => {
      if (file.includes(`-${slugifyItem(local)}-`)) {
        const destination = path.join(destinationPath, `${slugifyItem(local)}`, file)
        fs.rename(path.join(destinationPath, file), destination, err => {
          if (err) throw err;
          console.log('Moving ' + file);  
        });
      }
    })
  })
}

const forLoop = async _ => {
  console.log('taking fallbacks')
  for (const local of projectConfig.project.series) {
    createFolder(local)
    await init(local)
    await moveFiles(local)
  }
}

forLoop()

