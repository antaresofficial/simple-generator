import generateImage from "../index.js";
import { collection } from "./collection.js";

const getImage = async () => {
  const file = await generateImage("../assets/", collection, "./public/");
  console.log(file);
}

getImage()

