const AWS = require("aws-sdk");

export const S3 = new AWS.S3({
  region: "us-east-2",
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
});
