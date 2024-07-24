import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

const addLogToTable = async (importId, chunkNumber) => {
  console.log("Updating log table with chunk metadata");
  console.log("importId", importId);
  console.log("chunkNumber", chunkNumber);

  const params = {
    TableName: process.env.MIGRATION_LOG_TABLE,
    Item: {
      logId: { S: `${importId}_chunk${chunkNumber}` },
      importId: { S: importId },
      logUrl: { S: `${importId}/chunk_${chunkNumber}.json` },
      chunkNumber: { N: chunkNumber.toString() },
      createdAt: { S: new Date().toISOString() },
    },
  };
  console.log("params", params);

  try {
    const data = await dynamoClient.send(new PutItemCommand(params));
    console.log("DynamoDB response:", data);
  } catch (err) {
    console.error("DynamoDB error:", err);
  }
};

export default addLogToTable;
