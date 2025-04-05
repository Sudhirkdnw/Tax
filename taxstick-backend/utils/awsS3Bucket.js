const { S3 } = require("aws-sdk");
const uuid = require("uuid").v4;
const crypto = require('crypto')

exports.s3Upload = async (files, email) => {

  const s3 = new S3();

  const randNumber = crypto.randomBytes(8).toString("hex")

  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${process.env.WEBSITE_NAME}-storage/${email}/${randNumber}-${file.originalname}`,
      ACL: 'public-read',
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};