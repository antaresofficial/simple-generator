import { createCanvas, loadImage } from "canvas";
import { writeFileSync, readdirSync } from "fs";
import sizeOf from "image-size";
import { v4 as uuidv4 } from 'uuid';

const CANVAS_SIZE = [440, 440];

const generateRandomFolderMap = (root) => readdirSync(root).map((folder) => {
  const files = readdirSync(`${root}${folder}`);
  const index = Math.floor(Math.random() * files.length);
  return { [folder]: `${root}${folder}/${files[index]}` };
});

const generateImage = async (rootFolder, collection, path) => {
  const canvas = createCanvas(...CANVAS_SIZE);
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const metadate = [];
  generateRandomFolderMap(rootFolder).forEach(async (el) => collection.forEach((item) => item.name === Object.keys(el)[0] && metadate.push({ ...item, path: Object.values(el)[0] })));
  metadate.sort((a, b) => a.layer - b.layer);

  await new Promise((resolve) => metadate.forEach(async ({ path, top, left = 220 }) => {
    const { width } = sizeOf(path);
    const entity = await loadImage(path);
    const leftPadding = left - width / 2;
    ctx.drawImage(entity, leftPadding, top);
    resolve();
  }));

  writeFileSync(`${path}image-${uuidv4()}.png}`, canvas.toBuffer("image/png"));
};

export default generateImage;

