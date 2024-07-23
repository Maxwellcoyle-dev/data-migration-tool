import {
  DynamoDBClient,
  UpdateItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

const getLogTableItem = async (importId) => {
  const params = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    Key: {
      importId: { S: importId },
    },
  };

  try {
    const data = await dynamoClient.send(new GetItemCommand(params));
    console.log("DynamoDB response:", data);
    return data.Item;
  } catch (err) {
    console.error("DynamoDB error:", err);
  }
};

const updateLogTable = async (importId, chunkNumber, doceboResponse) => {
  console.log("Updating log table with chunk metadata");

  console.log("chunkNumber", chunkNumber);
  const logTableItem = await getLogTableItem(importId);
  console.log("logTableItem", logTableItem);
  const chunkCount = parseInt(logTableItem.chunkCount.N);
  console.log("chunkCount", chunkCount);

  let status;
  if (doceboResponse.success) {
    status = chunkCount === chunkNumber ? "completed" : "in-progress";
  }

  if (!doceboResponse.success) {
    status = "failed";
  }

  console.log("status", status);

  const params = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    Key: {
      importId: { S: importId },
    },
    UpdateExpression:
      "SET #status = :status, #statusMessage = :statusMessage, #s3Metadata = list_append(if_not_exists(#s3Metadata, :emptyList), :newChunk)",
    ExpressionAttributeNames: {
      "#status": "status",
      "#statusMessage": "statusMessage",
      "#s3Metadata": "s3ChunkMetadata",
    },
    ExpressionAttributeValues: {
      ":status": {
        S: status,
      },
      ":statusMessage": {
        S: doceboResponse.statusMessage,
      },
      ":emptyList": { L: [] },
      ":newChunk": {
        L: [
          {
            M: {
              chunk: { S: `chunk_${chunkNumber}` },
              url: {
                S: `${importId}/chunk_${chunkNumber}.json`,
              },
            },
          },
        ],
      },
    },
  };
  console.log("params", params);

  try {
    const data = await dynamoClient.send(new UpdateItemCommand(params));
    console.log("DynamoDB response:", data);
  } catch (err) {
    console.error("DynamoDB error:", err);
  }
};

export default updateLogTable;
