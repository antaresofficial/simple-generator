import { createCanvas, loadImage } from "canvas";
import { writeFileSync, readdirSync } from "fs";
import sizeOf from "image-size";
import { v4 as uuidv4 } from 'uuid';

const createKeys = (root) => readdirSync(root).map((folder) => {
  const files = readdirSync(`${root}${folder}`);
  const index = Math.floor(Math.random() * files.length);
  return { [folder]: `${root}${folder}/${files[index]}` };
});

const generateImage = async (rootFolder, collection, path) => {
  const canvas = createCanvas(440, 440);
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const result = [];
  createKeys(rootFolder).forEach(async (el) => {
    collection.forEach((item) => item.name === Object.keys(el)[0] && result.push({ ...item, path: Object.values(el)[0] }));
  });
  result.sort((a, b) => a.layer - b.layer);

  await result.forEach(async ({ path, top, left }) => {
    const { width } = sizeOf(path);
    const entity = await loadImage(path);
    const leftPadding = typeof left === "number" ? left : 220 - width / 2;
    ctx.drawImage(entity, leftPadding, top);
  });

  const file = `image-${uuidv4()}.png`;

  writeFileSync(`${path}${file}`, canvas.toBuffer("image/png"));
  return file;
};

export default generateImage;

