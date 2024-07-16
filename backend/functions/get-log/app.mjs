import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { Readable } from "stream";

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

  const getItemParams = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    Key: {
      importId: { S: id },
    },
  };

  const getItemCommand = new GetItemCommand(getItemParams);
  const getItemResponse = await dynamoClient.send(getItemCommand);

  console.log("getItemResponse", getItemResponse);
  console.log("getItemResponse.Item", getItemResponse.Item);

  const logItem = getItemResponse.Item;

  const logItemMetadata = logItem.s3ChunkMetadata.L.map((chunk) => {
    return {
      chunk: chunk.M.chunk.S,
      s3Key: chunk.M.url.S,
    };
  });
  console.log("logItemMetadata", logItemMetadata);

  //   get object from s3 bucket:
  const getParams = {
    Bucket: process.env.MIGRATION_LOG_S3_BUCKET,
    Key: logItemMetadata[0].s3Key,
  };
  console.log("getParams", getParams);

  const getObjectCommand = new GetObjectCommand(getParams);
  const getObject = await s3Client.send(getObjectCommand);

  console.log("getObjectResponse", getObject);

  const bodyContent = await streamToString(getObject.Body);
  //   convert bodyCOntent to JSON to send back to client

  const logContent = JSON.parse(bodyContent);
  console.log("bodyContent", bodyContent);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      logItem,
      logContent,
    }),
  };
};
