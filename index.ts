import axios from "axios";
import { createWriteStream } from "fs";

const overpassAPIPath = "http://overpass-api.de/api/interpreter?data=";
const overpassQL = `
[out:json];
area["name"~"東京都"]["boundary"="administrative"];
relation["admin_level"=7];
out body;
`;
const outputPath = `./output/${new Date()
  .toLocaleString("sv-SE")
  .replace(/[^\d]/g, "")}.geojson`;
const writable = createWriteStream(outputPath, "utf-8");

axios
  .get(overpassAPIPath + encodeURI(overpassQL))
  .then((row) => {
    writable.write(JSON.stringify(row.data));
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
