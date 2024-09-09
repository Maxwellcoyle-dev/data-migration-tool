import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

const updateLogTable = async (importId, chunkNumber) => {
  console.log("Updating log table with chunk metadata");
  console.log("importId", importId);
  console.log("chunkNumber", chunkNumber);

  const params = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    Key: {
      logId: { S: `${importId}_${chunkNumber}` },
      importId: { S: importId },
    },
    UpdateExpression: "SET #s3Metadata = :newChunk",
    ExpressionAttributeNames: {
      "#s3Metadata": "s3ChunkMetadata",
    },
    ExpressionAttributeValues: {
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
