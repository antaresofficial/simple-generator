import generateImage from "../index.js";
import { collection } from "./collection.js";

await generateImage("../assets/", collection, "./public/");

