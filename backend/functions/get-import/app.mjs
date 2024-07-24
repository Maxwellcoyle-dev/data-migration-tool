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
      body: JSON.stringify({ message: "import not found" }),
    };
  }

  if (importItem.status.S === "failed") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ importItem }),
    };
  }

  // get logs with GSI importId
  const getLogParams = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    IndexName: "importId-index",
    KeyConditionExpression: "importId = :importId",
    ExpressionAttributeValues: {
      ":importId": { S: id },
    },
  };

  const getLogs = new QueryCommand(getLogParams);
  const getLogsResponse = await dynamoClient.send(getLogs);
  console.log("getLogsResponse", getLogsResponse);

  const logItems = getLogsResponse.Items;
  console.log("logItems", logItems);

  // Process each logItem and retrieve the corresponding S3 object
  const logContent = [];

  for (const logItem of logItems) {
    const getParams = {
      Bucket: process.env.MIGRATION_LOG_S3_BUCKET,
      Key: logItem.logUrl.S,
    };
    console.log("getParams", getParams);

    const getObjectCommand = new GetObjectCommand(getParams);
    const getObject = await s3Client.send(getObjectCommand);
    const bodyContent = await streamToString(getObject.Body);

    let logs;
    try {
      logs = JSON.parse(bodyContent);
      if (logs && Array.isArray(logs.data)) {
        logContent.push(...logs.data); // Merge data content
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  console.log("allLogContents", logContent);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      importItem,
      logContent,
    }),
  };
};
