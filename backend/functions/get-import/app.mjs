import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });
const s3Client = new S3Client({ region: "us-east-2" });

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    };
  }
  console.log("event", event);

  const { id } = event.queryStringParameters;
  console.log("id", id);

  const getImportParams = {
    TableName: process.env.MIGRATION_IMPORT_TABLE,
    Key: {
      importId: { S: id },
    },
  };

  const getImport = new GetItemCommand(getImportParams);
  const getImportResponse = await dynamoClient.send(getImport);

  console.log("getImportResponse", getImportResponse);
  console.log("getImportResponse.Item", getImportResponse.Item);

  const importItem = getImportResponse.Item;

  if (!importItem) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ statusMessage: "import not found" }),
    };
  }

  // get the compiled Json file from the S3 bucket
  const getParams = {
    Bucket: process.env.MIGRATION_LOG_S3_BUCKET,
    Key: `${id}/compiled-logs.json`,
  };
  console.log("getParams", getParams);
  const getCompiledJsonLogsCommand = new GetObjectCommand(getParams);
  const getCompiledJsonLogs = await s3Client.send(getCompiledJsonLogsCommand);
  const compiledJsonLogs = await streamToString(getCompiledJsonLogs.Body);

  const jsonLogs = JSON.parse(compiledJsonLogs);
  console.log("jsonLogs", jsonLogs);


  // ------  Continue working here ------
  // get a presigned url for the compiled csv file
  const getPresignedUrlParams = {
    Bucket: process.env.MIGRATION_LOG_S3_BUCKET,
    Key: `${id}/compiled-logs.csv`,
    Expires: 60 * 30,
  };

  

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      importItem,
      jsonLogs,
    }),
  };
};
