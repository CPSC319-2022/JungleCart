#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { getParsedContext } from '../lib/configuration-parser';
import { ServiceLambda } from '../lib/service-lambda';
import { DatabaseStack } from '../stacks/database-stack';
import { ApiStack } from '../stacks/api-stack';
import { AuthenticationStack } from '../stacks/authentication-stack';

import { APIService } from '../stacks/api-resource-stack';
import { loadConfig } from '../lib/config-Loader';
const app = new cdk.App();

// configure environment
const context = getParsedContext(app);
// console.log(context);

console.log(loadConfig(app));

const dbStack = new DatabaseStack(app, 'DatabaseStack', {});
ServiceLambda.addVar('RDS_HOSTNAME', dbStack.hostname);

const API = new ApiStack(app, 'Api2', {});
createApiServices(API.api());

// services
new AuthenticationStack(app, 'AuthenticationStack', {});

function createApiServices(api) {
  if (context == null || context['services-config'] == null) {
    return;
  }
  if (context['services-config']['API'] == null) {
    return;
  }

  const ApiMicroservices = context['services-config']['API'];
  const lambdaConfig = context['lambda-config'];
  Object.entries(ApiMicroservices).forEach(([name, apiConfig]) => {
    const config = apiConfig as any;
    new APIService(app, name, {
      api: api,
      lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
      lambdaConfig: lambdaConfig,
      ...config,
    });
  });
}
