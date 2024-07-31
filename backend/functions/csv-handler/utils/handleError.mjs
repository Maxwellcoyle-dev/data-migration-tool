import newImportTableItem from "./newImportTableItem.mjs";

const handleError = async (importErrorPayload) => {
  if (importErrorPayload) {
    console.log("Updating import table with error message and status");
    console.log("importErrorPayload", importErrorPayload);

    await newImportTableItem(importErrorPayload);
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ importErrorPayload }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
};

export default handleError;
