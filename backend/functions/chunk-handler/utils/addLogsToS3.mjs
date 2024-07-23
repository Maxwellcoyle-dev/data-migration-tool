import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-2" });

const addLogsToS3 = async (importId, chunkNumber, doceboResponse) => {
  const s3Params = {
    Bucket: process.env.MIGRATION_LOG_S3_BUCKET,
    Key: `${importId}/chunk_${chunkNumber}.json`,
    Body: JSON.stringify(doceboResponse),
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(s3Params));
    console.log("S3 response:", data);
  } catch (err) {
    console.error("S3 error:", err);
  }
};

export default addLogsToS3;
