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
    ProjectExpression: "chunkCount",
  };

  try {
    const data = await dynamoClient.send(new GetItemCommand(params));
    console.log("Get Log Table Item response:", data);
    return data;
  } catch (err) {
    console.error("DynamoDB error:", err);
  }
};

const updateLogTable = async (
  importId,
  chunkNumber,
  chunkCount,
  doceboResponse
) => {
  console.log("Updating log table with chunk metadata");
  console.log("importId", importId);
  console.log("chunkNumber", chunkNumber);
  console.log("chunkCount", chunkCount);
  console.log("doceboResponse", doceboResponse);

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
