import Busboy from "busboy";
import { Readable } from "stream";
import csv from "csv-parser";

export const processMultipartForm = (event) => {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: event.headers });
    let fileData = [];
    let optionsData = "";
    let importType = "";
    let userId = "";
    let domain = "";

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      file.on("data", (data) => {
        fileData.push(data);
      });
      file.on("end", () => {
        console.log(`File [${fieldname}] finished`);
      });
    });

    busboy.on("field", (fieldname, val) => {
      if (fieldname === "options") {
        optionsData = JSON.parse(val);
      } else if (fieldname === "importType") {
        importType = val;
      } else if (fieldname === "userId") {
        userId = val;
      } else if (fieldname === "domain") {
        domain = val;
      }
    });

    busboy.on("finish", async () => {
      try {
        const buffer = Buffer.concat(fileData);
        resolve({
          fileData: buffer.toString(),
          optionsData,
          importType,
          userId,
          domain,
        });
      } catch (error) {
        onsole.error("Error during form finish:", error);
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
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(csvData);
    stream
      .pipe(csv())
      .on("data", (data) => {
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
