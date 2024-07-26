import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });

const handleErrors = async (chunkError, importId) => {
  console.log("handling error");
  console.log("error -- ", chunkError);

  // update import status in migration-imports table
  const updateParams = {
    TableName: process.env.MIGRATION_IMPORT_TABLE,
    Key: {
      importId: { S: importId },
    },
    UpdateExpression:
      "SET importStatus = :importStatus, statusMessage = :statusMessage",
    ExpressionAttributeValues: {
      ":importStatus": { S: "failed" },
      ":statusMessage": { S: chunkError.message },
    },
  };
  s;

  console.log("updateParams -- ", updateParams);

  const updateCommand = new UpdateItemCommand(updateParams);
  await client.send(updateCommand);
};

export default handleErrors;
