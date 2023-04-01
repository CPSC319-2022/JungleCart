#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { getParsedContext } from '../lib/configuration-parser';
import { ServiceLambda } from '../lib/service-lambda';
import { DatabaseStack } from '../stacks/database-stack';
import { ApiStack } from '../stacks/api-stack';
import { AuthenticationStack } from '../stacks/authentication-stack';

import { APIService } from '../stacks/api-resource-stack';
import { S3Stack } from '../stacks/s3-stack';
const app = new cdk.App();

// configure environment
const context = getParsedContext(app);

new DatabaseStack(app, 'DatabaseStack', {});

const s3 = new S3Stack(app, 'S3Stack', {});

const API = new ApiStack(app, 'Api2', {});
createApiServices(API.api());

// services
const authConfig = context
  ? context['services-config']['AuthenticationStack']
  : {};

new AuthenticationStack(app, 'AuthenticationStack', {
  ...authConfig,
});

function createApiServices(api) {
  if (context == null || context['services-config'] == null) {
    return;
  }
  if (context['services-config']['API'] == null) {
    return;
  }

  const ApiMicroservices = context['services-config']['API'];
  Object.entries(ApiMicroservices).forEach(([name, apiConfig]) => {
    const config = apiConfig as object;
    new APIService(app, name, {
      api: api,
      config: config,
      s3: s3.bucket,
    });
  });
}
