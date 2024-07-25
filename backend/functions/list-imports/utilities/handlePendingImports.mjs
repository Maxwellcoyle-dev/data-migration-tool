import {
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });

const handlePendingImports = async (importItem) => {
  console.log("handling pending import");
  console.log("pending importItem -- ", importItem);

  const importId = importItem.importId.S;
  const chunkCount = Number(importItem.chunkCount.N);

  // scan logs table for gsi items matching importId
  const params = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    IndexName: "importId-index",
    KeyConditionExpression: "importId = :importId",
    ExpressionAttributeValues: {
      ":importId": { S: importId },
    },
  };

  const command = new QueryCommand(params);
  const data = await client.send(command);

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
    status = "complete";
    message = "CSV import process complete.";

    // update import status in migration-imports table
    const updateParams = {
      TableName: process.env.MIGRATION_IMPORT_TABLE,
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
    await client.send(updateCommand);
    return { status, message };
  } else {
    status = "pending";
    message = `${processedChunks * 100} of ${chunkCount * 100} rows processed.`;

    return { status, message };
  }
};

export default handlePendingImports;
