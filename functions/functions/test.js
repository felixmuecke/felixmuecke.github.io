import fs from "fs";

const test = async () => {
  try {
    const dirContents = await fs.promises.readdir("./static/");
    console.log(dirContents);
  } catch (err) {
    console.error(err);
  }
};

test();
