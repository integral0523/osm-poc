import axios from "axios";
import { mkdirSync, writeFileSync } from "fs";
import osmtogeojson, { OsmToGeoJSONOptions } from "osmtogeojson";

const overpassAPIPath = "http://overpass-api.de/api/interpreter";
const overpassQL = `
[out:json];
area["name"~"練馬区"];
nwr["type"="boundary"]["boundary"="administrative"]["admin_level"=7](area);
(._;>;);
out body;
`;
const outputPath = `./output/${new Date()
  .toLocaleString("sv-SE")
  .replace(/[^\d]/g, "")}/`;

mkdirSync(outputPath);
writeFileSync(outputPath + "overpassQL.txt", overpassQL);

const url =
  overpassAPIPath +
  "?data=" +
  encodeURIComponent(overpassQL.replace(/\n/g, ""));
console.log(url);

axios
  .get(url)
  .then((response) => {
    writeFileSync(outputPath + "data.json", JSON.stringify(response.data));
    writeFileSync(
      outputPath + "test.geojson",
      JSON.stringify(
        osmtogeojson(response.data, {
          flatProperties: true,
        } as OsmToGeoJSONOptions)
      )
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
