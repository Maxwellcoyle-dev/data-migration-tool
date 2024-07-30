import { SQSClient, DeleteMessageCommand } from "@aws-sdk/client-sqs";

import { getAccessToken } from "./utils/getAccessToken.mjs";
import batchDoceboImport from "./utils/batchDoceboImport.mjs";
import nonBatchDoceboImport from "./utils/nonBatchDoceboImport.mjs";
import addLogsToS3 from "./utils/addLogsToS3.mjs";
import addLogToTable from "./utils/AddLogToTable.mjs";
import updateImportTable from "./utils/updateImportTable.mjs";
import handleErrors from "./utils/handlePendingImports.mjs";

export const handler = async (event) => {
  console.log("Event received:", event);

  const sqs = new SQSClient({ region: "us-east-2" });

  for (const record of event.Records) {
    let importId;
    try {
      const body = JSON.parse(record.body);
      const {
        chunk,
        chunkCount,
        chunkNumber,
        importId: importIdFromBody,
        userId,
        importType,
        importOptions,
        domain,
      } = body;

      importId = importIdFromBody; // Ensure importId is set here

      console.log(
        "Processing chunk:",
        chunk,
        chunkCount,
        chunkNumber,
        importId,
        userId,
        importType,
        importOptions,
        domain
      );

      // get the access token
      const accessToken = await getAccessToken(userId, domain);

      let doceboResponse;

      switch (importType) {
        case "groups":
          doceboResponse = await nonBatchDoceboImport(
            domain,
            importType,
            accessToken,
            chunk,
            importOptions
          );
          break;
        default:
          doceboResponse = await batchDoceboImport(
            domain,
            importType,
            accessToken,
            chunk,
            importOptions
          );
      }

      if (!doceboResponse.success) {
        // update importtable with error
        await updateImportTable(importId, doceboResponse.statusMessage);
        return {
          statusCode: 500,
          body: JSON.stringify({
            status: "Docebo API Error",
          }),
        };
      }

      console.log("importId", importId);
      // store logs in S3
      await addLogsToS3(importId, chunkNumber, doceboResponse);

      // update DynamoDB with the log
      await addLogToTable(importId, chunkNumber, doceboResponse);

      // delete processed SQS message
      const deleteParams = {
        QueueUrl: process.env.CHUNK_SQS_URL,
        ReceiptHandle: record.receiptHandle,
      };
      console.log("Deleting message from SQS");
      const data = await sqs.send(new DeleteMessageCommand(deleteParams));
      console.log("Delete message response:", data);
    } catch (error) {
      if (importId) {
        handleErrors(error, importId);
      }
      console.error("Error processing message:", error);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "Batch processing completed",
    }),
  };
};
