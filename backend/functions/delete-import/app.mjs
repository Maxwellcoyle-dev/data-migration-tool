import {
  DynamoDBClient,
  GetItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

const region = "us-east-2";

const dynamoClient = new DynamoDBClient({ region });
const s3Client = new S3Client({ region });

const MIGRATION_IMPORT_TABLE = process.env.MIGRATION_IMPORT_TABLE;
const MIGRATION_LOG_S3_BUCKET = process.env.MIGRATION_LOG_S3_BUCKET;

export const handler = async (event) => {
  console.log("Event: ", event);
  const { importId, userId } = event.queryStringParameters;
  console.log("Import ID: ", importId);
  console.log("User ID: ", userId);

  try {
    // 1. Get the import from the import table
    const importItem = await dynamoClient.send(
      new GetItemCommand({
        TableName: MIGRATION_IMPORT_TABLE,
        Key: {
          importId: { S: importId },
        },
      })
    );

    console.log("Import Item: ", importItem);

    // 2. Check if importStatus is pending
    if (!importItem.Item) {
      throw new Error("Import not found");
    }

    if (importItem.Item.importStatus.S === "pending") {
      console.log("Import is still pending");
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        statusCode: 400,
        body: JSON.stringify({ message: "Import is still pending" }),
      };
    }

    // 4. Delete the import item from the import table
    const deleteImportItemResponse = await dynamoClient.send(
      new DeleteItemCommand({
        TableName: MIGRATION_IMPORT_TABLE,
        Key: {
          importId: { S: importId },
        },
      })
    );
    console.log("Delete Import Item Response: ", deleteImportItemResponse);

    // list all objects in the importId folder
    const listObjectsResponse = await s3Client.send(
      new ListObjectsCommand({
        Bucket: MIGRATION_LOG_S3_BUCKET,
        Prefix: `${importId}/`,
      })
    );
    console.log("List Objects Response: ", listObjectsResponse);

    if (listObjectsResponse.Contents?.length === 0) {
      // 5. Delete all of the objects from the S3 bucket using the deleteObjects command
      const deleteObjectsResponse = await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: MIGRATION_LOG_S3_BUCKET,
          Delete: {
            Objects: listObjectsResponse.Contents?.map((object) => ({
              Key: object.Key,
            })),
          },
        })
      );
      console.log("Delete Objects Response: ", deleteObjectsResponse);
    }

    // return with cors headers
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ message: "Import deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting import:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting import",
        error: error.message,
      }),
    };
  }
};
