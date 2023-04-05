import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { PhysicalName } from 'aws-cdk-lib';
import { EnvironmentStack } from '../lib/environment-stack';

// Define your CDK stack
export class S3Stack extends EnvironmentStack {
  public readonly bucket: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket
    this.bucket = new s3.Bucket(this, 'MyBucket', {
      bucketName: PhysicalName.GENERATE_IF_NEEDED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      publicReadAccess: false,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: [
            'http://localhost:3000',
            'https://main.d80mxyatc2g3o.amplifyapp.com/',
          ],
          allowedHeaders: ['*'],
        },
      ],
    });

    this.bucket.grantPublicAccess();

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: this.bucket.bucketName,
    });
  }
}
