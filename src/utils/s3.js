const AWS = require("aws-sdk");

const s3Client = new AWS.S3({
  signatureVersion: "v4",
});

const S3 = {
  async PUTSignedURL(bucket, fileName, type) {
    return s3Client.getSignedUrl("putObject", {
      Bucket: bucket,
      ContentType: type,
      Expires: 60 * 5,
      Key: fileName,
    });
  },
  async PUTPublicSignedURL(bucket, fileName, type) {
    return s3Client.getSignedUrl("putObject", {
      Bucket: bucket,
      ContentType: type,
      ACL: "public-read",
      Expires: 60 * 5,
      Key: fileName,
    });
  },
  async GETSignedURL(bucket, fileName) {
    return s3Client.getSignedUrl("getObject", {
      Bucket: bucket,
      Expires: 60 * 5,
      Key: fileName,
    });
  },
};

module.exports = S3;
