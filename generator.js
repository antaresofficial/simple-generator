const { createCanvas, loadImage } = require("canvas");
const { writeFileSync, readdirSync, readdir } = require("fs");
const sizeOf = require('image-size');

const canvas = createCanvas(440, 440);
const ctx = canvas.getContext("2d", { alpha: false });

const f = './assets';

const folders = readdirSync(f);
const keys = folders.map((folder) => {
  const files = readdirSync(`${f}/${folder}`);
  const index = Math.floor(Math.random() * files.length);
  return { [folder]: `${f}/${folder}/${files[index]}` };
});

const params = [
  { name: 'head', top: 58, layer: 2 },
  { name: 'body', top: 225, layer: 3 },
  { name: 'background', top: 0, width: '0', layer: 1 },
  { name: 'eyes', top: 145, layer: 4 },
  { name: 'eyebrows', top: 120, layer: 4 },
  { name: 'glasses', top: 142, layer: 5 },
  { name: 'mouth', top: 170, layer: 4 },
  { name: 'top', top: 8, layer: 6 },
  { name: 'pet', top: 210, layer: 6, width: '100' },
];

const generateImage = async () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const full = [];
  keys.forEach(async (el) => {
    params.forEach((v) => v.name === Object.keys(el)[0] && full.push({ ...v, path: Object.values(el)[0] }));
  });
  full.sort((a, b) => a.layer - b.layer);

  await full.forEach(async (el) => {
    const { width, height } = sizeOf(el.path);
    const entity = await loadImage(el.path);
    ctx.drawImage(entity, el.width ? +el.width : 220 - width / 2, el.top);
  })

  writeFileSync(
    `image.png`,
    canvas.toBuffer("image/png")
  );
};

generateImage();
