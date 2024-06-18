import Busboy from "busboy";
import { Readable } from "stream";
import csv from "csv-parser";

export const processMultipartForm = (event) => {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: event.headers });
    let fileData = [];
    let optionsData = "";
    let importType = "";

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log(`File [${fieldname}] received: ${filename} (${mimetype})`);
      file.on("data", (data) => {
        console.log(`File [${fieldname}] received ${data.length} bytes`);
        fileData.push(data);
      });
      file.on("end", () => {
        console.log(`File [${fieldname}] finished`);
      });
    });

    busboy.on("field", (fieldname, val) => {
      console.log(`Field [${fieldname}]: value received`);
      if (fieldname === "options") {
        optionsData = JSON.parse(val);
      } else if (fieldname === "importType") {
        importType = val;
      }
    });

    busboy.on("finish", async () => {
      try {
        const buffer = Buffer.concat(fileData);
        console.log("File data buffer:", buffer.toString());
        resolve({
          fileData: buffer.toString(),
          optionsData,
          importType,
        });
      } catch (error) {
        reject(error);
      }
    });

    busboy.on("error", (error) => {
      console.error("Busboy error:", error);
      reject(error);
    });

    busboy.end(Buffer.from(event.body, "base64"));
  });
};

export const csvToJson = (csvData) => {
  console.log("Converting CSV to JSON");
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(csvData);
    stream
      .pipe(csv())
      .on("data", (data) => {
        console.log("CSV row data:", JSON.stringify(data, null, 2));
        results.push(data);
      })
      .on("end", () => {
        console.log("CSV parsing complete");
        resolve(results);
      })
      .on("error", (error) => {
        console.error("Error parsing CSV:", error);
        reject(error);
      });
  });
};
