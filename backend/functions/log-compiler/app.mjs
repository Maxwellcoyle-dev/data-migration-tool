import { SQSClient, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Parser } from "@json2csv/plainjs";

const MIGRATION_IMPORT_TABLE = process.env.MIGRATION_IMPORT_TABLE;
const MIGRATION_LOG_TABLE = process.env.MIGRATION_LOG_TABLE;
const MIGRATION_LOG_S3_BUCKET = process.env.MIGRATION_LOG_S3_BUCKET;

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });
const s3Client = new S3Client({ region: "us-east-2" });

// Helper function to stream S3 objects
const streamToString = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

export const handler = async (event) => {
  console.log("Event received:", event);

  const record = event.Records[0];
  const body = JSON.parse(record.body);
  console.log("body", body);

  const { importId, userId } = body;
  console.log("importId", importId);
  console.log("userId", userId);

  //   Get the import item from DynamoDB MIGRATION IMPORT TABLE -

  const getImportParams = {
    TableName: MIGRATION_IMPORT_TABLE,
    Key: {
      importId: { S: importId },
    },
  };

  const getImport = new GetItemCommand(getImportParams);
  const getImportResponse = await dynamoClient.send(getImport);

  console.log("getImportResponse", getImportResponse);
  console.log("getImportResponse.Item", getImportResponse.Item);

  const importItem = getImportResponse.Item;

  if (!importItem) {
    console.log("Import not found");
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ statusMessage: "import not found" }),
    };
  }

  // Get the logs for the import from the DynamoDB MIGRATION LOG TABLE

  const getLogParams = {
    TableName: MIGRATION_LOG_TABLE,
    IndexName: "importId-index",
    KeyConditionExpression: "importId = :importId",
    ExpressionAttributeValues: {
      ":importId": { S: importId },
    },
  };

  const getLogs = new QueryCommand(getLogParams);
  const getLogsResponse = await dynamoClient.send(getLogs);
  console.log("getLogsResponse", getLogsResponse);

  const logItems = getLogsResponse.Items;
  console.log("logItems", logItems);

  if (!logItems || logItems.length === 0) {
    console.log("Logs not found");
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ statusMessage: "logs not found" }),
    };
  }

  // Process each logItem and retrieve the corresponding S3 object
  // 3. Fetch all logs from S3 in parallel

  const logPromises = logItems.map(async (logItem) => {
    const getParams = {
      Bucket: MIGRATION_LOG_S3_BUCKET,
      Key: logItem.logUrl.S,
    };

    const getObjectCommand = new GetObjectCommand(getParams);
    const getObjectResponse = await s3Client.send(getObjectCommand);

    // Handle large object streams efficiently
    const bodyContent = await streamToString(getObjectResponse.Body);

    try {
      const logs = JSON.parse(bodyContent);
      if (logs && Array.isArray(logs.data)) {
        return logs.data; // Return data content
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  });

  // Wait for all promises to resolve
  const logContents = await Promise.all(logPromises);

  // Flatten the array of log contents
  const allLogContent = logContents.flat();
  console.log("All log contents:", allLogContent);

  // Add the new compiled log to S3 bucket as 1 JSON FIle
  const s3Params = {
    Bucket: MIGRATION_LOG_S3_BUCKET,
    Key: `${importId}/compiled-logs.json`,
    Body: JSON.stringify(allLogContent),
  };
  console.log("s3Params", s3Params);

  try {
    const jsonUploadResponse = await s3Client.send(
      new PutObjectCommand(s3Params)
    );
    console.log("S3 response:", jsonUploadResponse);
  } catch (err) {
    console.error("S3 error:", err);
  }

  // Convert the log content to CSV
  try {
    const parser = new Parser();
    const csv = parser.parse(allLogContent); // Correctly parse the log content to CSV format
    console.log("CSV:", csv);

    // Add the new csv file to S3 bucket
    const s3ParamsforCSV = {
      Bucket: MIGRATION_LOG_S3_BUCKET,
      Key: `${importId}/compiled-logs.csv`,
      Body: csv, // Directly pass the parsed CSV content
      ContentType: "text/csv", // Make sure to set the correct content type
    };

    console.log("s3ParamsforCSV", s3ParamsforCSV);

    const csvUploadResponse = await s3Client.send(
      new PutObjectCommand(s3ParamsforCSV)
    );

    console.log("S3 response for CSV:", csvUploadResponse);
  } catch (error) {
    console.error("Error parsing or uploading CSV:", error);
  }

  // update import status in migration-imports table
  const updateParams = {
    TableName: MIGRATION_IMPORT_TABLE,
    Key: {
      importId: { S: importId },
    },
    UpdateExpression:
      "SET importStatus = :importStatus, statusMessage = :statusMessage",
    ExpressionAttributeValues: {
      ":importStatus": { S: "complete" },
      ":statusMessage": { S: "Import complete and logs compiled." },
    },
  };

  console.log("updateParams -- ", updateParams);

  const updateCommand = new UpdateItemCommand(updateParams);
  await dynamoClient.send(updateCommand);

  // -----
  // -----
  // return success response
  return {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
};
