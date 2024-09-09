import {
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const dynamoDBClient = new DynamoDBClient({ region: "us-east-2" });
const sqsClient = new SQSClient({ region: "us-east-2" });

const MIGRATION_IMPORT_TABLE = process.env.MIGRATION_IMPORT_TABLE;
const MIGRATION_LOG_TABLE = process.env.MIGRATION_LOG_TABLE;
const COMPILER_SQS_URL = process.env.COMPILER_SQS_URL;

const handlePendingImports = async (importItem) => {
  console.log("handling pending import");
  console.log("pending importItem -- ", importItem);

  const importId = importItem.importId.S;
  const chunkCount = Number(importItem.chunkCount.N);

  // scan logs table for gsi items matching importId
  const params = {
    TableName: MIGRATION_LOG_TABLE,
    IndexName: "importId-index",
    KeyConditionExpression: "importId = :importId",
    ExpressionAttributeValues: {
      ":importId": { S: importId },
    },
  };

  const command = new QueryCommand(params);
  const data = await dynamoDBClient.send(command);

  console.log("log Data -- ", data);

  let processedChunks = data.Items.length;
  console.log("processedChunks -- ", processedChunks);
  console.log("chunkCount -- ", chunkCount);

  console.log(
    "processedChunks === chunkCount -- ",
    processedChunks === chunkCount
  );

  let status;
  let message;
  if (processedChunks === chunkCount) {
    status = "compiling logs";
    message = "CSV import process complete.";

    // update import status in migration-imports table
    const updateParams = {
      TableName: MIGRATION_IMPORT_TABLE,
      Key: {
        importId: { S: importId },
      },
      UpdateExpression:
        "SET importStatus = :importStatus, statusMessage = :statusMessage",
      ExpressionAttributeValues: {
        ":importStatus": { S: status },
        ":statusMessage": { S: message },
      },
    };

    console.log("updateParams -- ", updateParams);

    const updateCommand = new UpdateItemCommand(updateParams);
    await dynamoDBClient.send(updateCommand);

    // Send message to Compiler Queue - to compile the logs
    const sqsParams = {
      QueueUrl: COMPILER_SQS_URL,
      MessageBody: JSON.stringify({
        importId,
        userId: importItem.userId.S,
      }),
    };

    console.log("sqsParams -- ", sqsParams);

    await sqsClient.send(new SendMessageCommand(sqsParams));

    return { status, message };
  } else {
    status = "pending";
    message = `${processedChunks * 100} of ${chunkCount * 100} rows processed.`;

    return { status, message };
  }
};

export default handlePendingImports;
