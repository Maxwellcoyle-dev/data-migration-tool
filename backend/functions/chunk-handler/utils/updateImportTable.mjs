import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

const updateImportTable = async (importId, statusMessage) => {
  console.log("Updating import table Docebo API error message and stauts");
  console.log("importId", importId);
  console.log("statusMessage", statusMessage);

  const params = {
    TableName: process.env.MIGRATION_IMPORT_TABLE,
    Key: {
      importId: { S: importId },
    },
    UpdateExpression: "SET importStatus = :s, statusMessage = :m",
    ExpressionAttributeValues: {
      ":s": { S: "failed" },
      ":m": { S: statusMessage },
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

export default updateImportTable;
