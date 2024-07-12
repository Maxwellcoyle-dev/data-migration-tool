export const chunkSQSMessageEvent = {
  Records: [
    {
      messageId: "b1bbbd80-3d9f-426f-9047-fc5ccf0c0ae0",
      receiptHandle:
        "AQEBrIIPAW5xl+C70p2xqvDFCYZ1ZBfOiMVnDW9OSLj+7LvPVFF41Lw7uZFfrHYbMH1Z7PTE9aNB43A3MDTGPYTaLoBwt6Mudw1qMaSIlkMe/LXRPp/th29/GH7gUqj/2vegRAn23mjW6vlmwkcXfwp33ONp4gyXRkJP2mmDha1JdJmSoN1u7pIThDj7tvclge8ZON0XnKjP+opsZ026R/K8gerDlUnTpXEtCjPOOpK7hmIAp8ThEigwoJYRNOQORQOqPD1DmmLSv2W7IvT+zSP17UhWkmNhGlgNZJRAbaKN8u4WxPlUwEyCnIaSTqKfOvCP+ui2sBkVvuZtvO+/m3yG7rp1VD7r+uOd7t7jS17Ek/lef9UWBGVQgxP6vH8TZ0H+tZGHFWPFBDnkO4vCqf86SQ==",
      body: '{"chunk":[{"code":"C01","name":"Demo Catalog 01","description":"A Catalog to test the catalog type import"},{"code":"C02","name":"Demo Catalog 02","description":"A Catalog to test the catalog type import"},{"code":"C03","name":"Demo Catalog 03","description":"A Catalog to test the catalog type import"}],"importId":"fb8776a8-e511-463a-87a4-ef1a756866cc","userId":"41cb6520-0021-705c-3359-2421214e90d3","importType":"catalogs","importOptions":{},"domain":"traintopia.docebosaas.com"}',
      attributes: [Object],
      messageAttributes: {},
      md5OfBody: "f6ce3d2fc952a418dfd4b6a8fc03392f",
      eventSource: "aws:sqs",
      eventSourceARN:
        "arn:aws:sqs:us-east-2:950809776337:DoceboDataMigrationQueue",
      awsRegion: "us-east-2",
    },
  ],
};
