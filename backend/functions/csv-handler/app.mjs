// 1. Process multipart form data
// 2. convert csv to json
// 3. transoform json data based on importType
// 4. create import metadata - {importId, userId, status, importType, importOptions, domain, importDate}
// 5. split data into chunks of 300 items - send each chunk to sqs queue - {chunk, importId, optionsData, userId, importType, domain}
// 6. create a record with metadata in DoceboMigrationLogTable - {importId, userId, status, importType, domain, importDate}

// import { csvHandlerEvent as event } from "../events.mjs";

import { v4 as uuidv4 } from "uuid";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import transformCatalogs from "./utils/transformCatalogs.mjs";
import transformCourses from "./utils/transformCourses.mjs";
import transformGroups from "./utils/tranformGroups.mjs";
import transformBranches from "./utils/transformBranches.mjs";
import transformEnrollments from "./utils/transformEnrollments.mjs";

const sqsClient = new SQSClient({ region: "us-east-2" });
const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  //   Process the multipart form data
  const { fileData, importOptions, userId, domain, importType } =
    await processMultipartForm(event);

  console.log(
    "Received data:",
    fileData,
    importOptions,
    userId,
    domain,
    importType
  );

  //   Convert CSV to JSON
  const jsonData = await csvToJson(fileData);
  console.log("jsonData", jsonData);

  let importData;

  //   Transform JSON data based on importType
  switch (importType) {
    case "catalogs":
      importData = transformCatalogs(jsonData);
      break;
    case "courses":
      importData = transformCourses(jsonData);
      break;
    case "groups":
      importData = transformGroups(jsonData);
      break;
    case "branches":
      importData = transformBranches(jsonData);
      break;
    case "enrollments":
      importData = transformEnrollments(jsonData);
      break;
    default:
      throw new Error("Invalid import type");
  }

  const { transformedData, batchCount } = importData;
  console.log("batchCount", batchCount);
  console.log("transformedData", transformedData);

  const importId = uuidv4();

  const importMetadata = {
    importId,
    userId,
    status: "pending",
    importType,
    importOptions,
    domain,
    importDate: new Date().toISOString(),
  };
  console.log("importMetadata", importMetadata);

  // Split data into chunks of 300 items or less
  const maxChunkSize = batchCount;
  const chunks = [];
  const chunkCount = Math.ceil(transformedData.length / maxChunkSize);
  console.log("chunkCount", chunkCount);
  for (let i = 0; i < transformedData.length; i += maxChunkSize) {
    chunks.push(transformedData.slice(i, i + maxChunkSize));
  }
  console.log("chunks", chunks);

  try {
    // Send each chunk into SQS queue
    for (const chunk of chunks) {
      const chunkNumber = chunks.indexOf(chunk) + 1;
      const sqsParams = {
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify({
          chunk,
          chunkCount,
          chunkNumber,
          importId,
          userId,
          importType,
          importOptions,
          domain,
        }),
      };
      console.log("sqsParams", sqsParams);

      await sqsClient.send(new SendMessageCommand(sqsParams));
    }

    // Create a record with metadata in DoceboMigrationLogTable
    const dynamoParams = {
      TableName: process.env.MIGRATION_LOG_TABLE,
      Item: {
        importId: { S: importId },
        userId: { S: userId },
        status: { S: "pending" },
        statusMessage: { S: "Chunks sent to handler." },
        importType: { S: importType },
        chunkCount: { N: chunkCount.toString() },
        s3ChunkMetadata: { L: [] },
        importOptions: { S: JSON.stringify(importOptions) },
        domain: { S: domain },
        importDate: { S: importMetadata.importDate },
      },
    };
    console.log("dynamoParams", dynamoParams);

    await dynamoClient.send(new PutItemCommand(dynamoParams));
  } catch (error) {
    console.error("error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        importId: importMetadata.importId,
        status: "failed",
        message: "Error saving metadata to DynamoDB",
        error: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(importMetadata),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
};
