import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'us-east-2',
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export default client;