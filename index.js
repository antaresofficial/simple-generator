import { createCanvas, loadImage } from "canvas";
import { writeFileSync, readdirSync } from "fs";
import sizeOf from "image-size";

const createKeys = (root) => readdirSync(root).map((folder) => {
  const files = readdirSync(`${root}${folder}`);
  const index = Math.floor(Math.random() * files.length);
  return { [folder]: `${root}${folder}/${files[index]}` };
});

const generateImage = async (rootFolder, collection) => {
  const canvas = createCanvas(440, 440);
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const result = [];
  createKeys(rootFolder).forEach(async (el) => {
    collection.forEach((item) => item.name === Object.keys(el)[0] && result.push({ ...item, path: Object.values(el)[0] }));
  });
  result.sort((a, b) => a.layer - b.layer);

  await result.forEach(async ({ path, top }) => {
    const { width } = sizeOf(path);
    const entity = await loadImage(path);
    ctx.drawImage(entity, 220 - width / 2, top);
  });

  writeFileSync("image.png", canvas.toBuffer("image/png"));
};

export default generateImage;

