import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });

const newImportTableItem = async (importErrorPayload) => {
  console.log("creating new import table item");
  console.log("importErrorPayload", importErrorPayload);

  const {
    importId,
    userId,
    importStatus,
    statusMessage,
    importType,
    chunkCount,
    importOptions,
    domain,
    importDate,
    fileName,
  } = importErrorPayload;

  const params = {
    TableName: process.env.MIGRATION_IMPORT_TABLE,
    Item: {
      importId: { S: importId },
      userId: { S: userId },
      importStatus: { S: importStatus },
      statusMessage: { S: statusMessage },
      importType: { S: importType },
      ...(chunkCount && { chunkCount: { N: chunkCount.toString() } }),
      // check if importOptions object is empty, if it is, do not add the field at all
      ...(Object.keys(importOptions).length > 0 && {
        importOptions: { S: JSON.stringify(importOptions) },
      }),
      fileName: { S: fileName },
      domain: { S: domain },
      importDate: { S: importDate },
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

export default newImportTableItem;
