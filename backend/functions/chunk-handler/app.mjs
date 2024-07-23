// process the message form sqs
// get the access token from dynamoDB
// post send data to Docebo API
// process logs & store in S3
// update dynamoDB Item with status, s3 metadata

import { getAccessToken } from "./utils/getAccessToken.mjs";
import batchDoceboImport from "./utils/batchDoceboImport.mjs";
import nonBatchDoceboImport from "./utils/nonBatchDoceboImport.mjs";
import addLogsToS3 from "./utils/addLogsToS3.mjs";
import updateLogTable from "./utils/updateLogTable.mjs";

// import { chunkSQSMessageEvent as event } from "../events.mjs";

export const handler = async (event) => {
  console.log(event);

  // process the message
  const body = JSON.parse(event.Records[0].body);
  const {
    chunk,
    chunkNumber,
    importId,
    userId,
    importType,
    importOptions,
    domain,
  } = body;

  console.log(
    "Received chunk:",
    chunk,
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

  if (doceboResponse.success === false) {
    // update DynamoDB item
    await updateLogTable(importId, chunkNumber, doceboResponse);

    return {
      statusCode: 500,
      body: JSON.stringify({
        importId,
        status: "failed",
        message: doceboResponse.statusMessage,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  // store logs in S3
  await addLogsToS3(importId, chunkNumber, doceboResponse);

  await updateLogTable(importId, chunkNumber, doceboResponse);

  return {
    statusCode: 200,
    body: JSON.stringify({
      importId,
      status: "success",
      message: "Chunk processed successfully",
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
};
