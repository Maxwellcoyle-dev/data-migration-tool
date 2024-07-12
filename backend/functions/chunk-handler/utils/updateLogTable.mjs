import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

const updateLogTable = async (importId, chunkNumber) => {
  const params = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    Key: {
      importId: { S: importId },
    },
    UpdateExpression: "SET #status = :status, #s3Metadata = :s3Metadata",
    ExpressionAttributeNames: {
      "#status": "status",
      // s3ChunkMetadata is an array of chunk numbers and their corresponding S3 URLs
      "#s3Metadata": "s3ChunkMetadata",
    },
    ExpressionAttributeValues: {
      ":status": { S: "in-progress" },
      // add the new chunk number and S3 URL to the existing array
      ":s3Metadata": {
        L: [
          {
            M: {
              chunk: { S: `chunk_${chunkNumber}` },
              url: {
                S: `s3://${process.env.MIGRATION_LOG_S3_BUCKET}/${importId}/chunk_${chunkNumber}.json`,
              },
            },
          },
        ],
      },
    },
  };

  try {
    const data = await dynamoClient.send(new UpdateItemCommand(params));
    console.log("DynamoDB response:", data);
  } catch (err) {
    console.error("DynamoDB error:", err);
  }
};

export default updateLogTable;
