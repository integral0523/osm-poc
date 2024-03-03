import axios from "axios";
import { mkdirSync, writeFileSync } from "fs";
import osmtogeojson, { OsmToGeoJSONOptions } from "osmtogeojson";

const overpassAPIPath = "http://overpass-api.de/api/interpreter?data=";
const overpassQL = `
[out:json];
area["name"~"東京都"];
node
    ['name' ~ '郵便局$'];
out;
`;
const outputPath = `./output/${new Date()
  .toLocaleString("sv-SE")
  .replace(/[^\d]/g, "")}/`;

mkdirSync(outputPath);
writeFileSync(outputPath + "overpassQL.txt", overpassQL);

axios
  .get(overpassAPIPath + encodeURI(overpassQL))
  .then((response) => {
    writeFileSync(outputPath + "data.json", JSON.stringify(response.data));
    writeFileSync(
      outputPath + "test.geojson",
      JSON.stringify(osmtogeojson(response.data, {} as OsmToGeoJSONOptions))
    );
    console.log("DONE");
  })
  .catch((e) => {
    writeFileSync(outputPath + "error.log", JSON.stringify(e));
    console.error("ERROR");
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
