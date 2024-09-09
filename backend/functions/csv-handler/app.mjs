import { v4 as uuidv4 } from "uuid";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { processMultipartForm, csvToJson } from "./utils/multipartUtils.mjs";
import transformCatalogs from "./utils/transformCatalogs.mjs";
import transformCourses from "./utils/transformCourses.mjs";
import transformGroups from "./utils/tranformGroups.mjs";
import transformBranches from "./utils/transformBranches.mjs";
import transformEnrollments from "./utils/transformEnrollments.mjs";
import transformLearningObject from "./utils/transformLearningObjects.mjs";
import transformCatalogItems from "./utils/transformCatalogItems.mjs";

import handleError from "./utils/handleError.mjs";

const sqsClient = new SQSClient({ region: "us-east-2" });
const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    let importMetadata = null; // Ensure importMetadata is defined
    // Process the multipart form data
    const { fileData, importOptions, userId, domain, importType, fileName } =
      await processMultipartForm(event);

    console.log("fileData", fileData);
    console.log("importOptions", importOptions);
    console.log("userId", userId);
    console.log("domain", domain);
    console.log("importType", importType);
    console.log("fileName", fileName);

    // Convert CSV to JSON
    const jsonData = await csvToJson(fileData);
    console.log("jsonData", jsonData);

    let importData;
    console.log("importType", importType);

    // Define importMetadata as early as possible
    const importId = uuidv4();
    importMetadata = {
      importId,
      userId,
      importStatus: "pending",
      statusMessage: "CSV import has been initiated.",
      importType,
      importOptions,
      fileName,
      domain,
      importDate: new Date().toISOString(),
    };

    try {
      // Transform JSON data based on importType
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
        case "learning_objects":
          importData = transformLearningObject(jsonData);
          break;
        case "catalog_items":
          importData = transformCatalogItems(jsonData);
          break;
        default:
          throw new Error("Invalid import type");
      }
    } catch (error) {
      console.error("Transformation error:", error);
      const importErrorPayload = {
        importId,
        userId,
        importStatus: "failed",
        statusMessage: `${error.message} -- Import type did not match any of the available types. please report this error to: max.henderson@trainicity.com`,
        importType,
        importOptions,
        fileName,
        domain,
        importDate: importMetadata.importDate,
      };
      return await handleError(importErrorPayload);
    }

    const { transformedData, batchCount } = importData;
    console.log("batchCount", batchCount);
    console.log("transformedData", transformedData);

    console.log("importMetadata", importMetadata);

    // Split data into chunks of 300 items or less
    const maxChunkSize = batchCount;
    const chunks = [];
    const chunkCount = Math.ceil(transformedData?.length / maxChunkSize);
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
            fileName,
            importType,
            importOptions,
            domain,
          }),
        };
        console.log("sqsParams", sqsParams);

        await sqsClient.send(new SendMessageCommand(sqsParams));
      }
    } catch (error) {
      console.error("SQS error:", error);

      const importErrorPayload = {
        importId,
        userId,
        importStatus: "failed",
        statusMessage: `${error.message} -- sending messages to SQS`,
        importType,
        chunkCount,
        fileName,
        importOptions,
        domain,
        importDate: importMetadata.importDate,
      };

      return await handleError(importErrorPayload);
    }

    try {
      // Create a record with metadata in DoceboMigrationLogTable
      const dynamoParams = {
        TableName: process.env.MIGRATION_IMPORT_TABLE,
        Item: {
          importId: { S: importId },
          userId: { S: userId },
          importStatus: { S: "pending" },
          statusMessage: { S: "CSV import has been initiated." },
          importType: { S: importType },
          chunkCount: { N: chunkCount.toString() },
          fileName: { S: fileName },
          importOptions: { S: JSON.stringify(importOptions) },
          domain: { S: domain },
          importDate: { S: importMetadata.importDate },
        },
      };
      console.log("dynamoParams", dynamoParams);

      await dynamoClient.send(new PutItemCommand(dynamoParams));
    } catch (error) {
      console.error("DynamoDB error:", error);
      const importErrorPayload = {
        importId,
        userId,
        importStatus: "failed",
        statusMessage: `${error.message} -- saving metadata to DynamoDB`,
        importType,
        chunkCount,
        fileName,
        importOptions,
        domain,
        importDate: importMetadata.importDate,
      };
      const response = await handleError(importErrorPayload);
      return response;
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
  } catch (error) {
    console.error("General error:", error);
    const importErrorPayload = {
      importId,
      userId,
      importStatus: "failed",
      statusMessage: `${error.message} -- saving metadata to DynamoDB`,
      importType,
      chunkCount,
      fileName,
      importOptions,
      domain,
      importDate: importMetadata.importDate,
    };
    return {
      statusCode: 400,
      body: JSON.stringify({ importErrorPayload }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }
};
