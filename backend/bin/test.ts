import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import NetworkError from '../src/layer/common/core/NetworkError';
import { MethodResponse } from 'aws-cdk-lib/aws-apigateway/lib/methodresponse';
import * as fs from "fs";

const app = new cdk.App();

const stack = new cdk.Stack(app, 'mystack', {
  env: {
    region: 'us-east-1',
    account: '846202041248',
  },
});

const myLambda = new lambda.Function(stack, 'MyLambda', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset('./bin/src'),
  layers: [
    new lambda.LayerVersion(stack, 'error', {
      code: lambda.Code.fromAsset('./dist/src/layer/common'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    }),
  ],
});

const api = new apigateway.RestApi(stack, 'MyApi', {
  restApiName: 'My API',
  defaultCorsPreflightOptions: {
    allowOrigins: apigateway.Cors.ALL_ORIGINS,
    allowMethods: apigateway.Cors.ALL_METHODS,
  },
});

const okResponseModel = new apigateway.Model(stack, 'OkResponseModel', {
  restApi: api,
  modelName: 'OkResponse',
  schema: {
    schema: apigateway.JsonSchemaVersion.DRAFT4,
    title: 'OkResponse',
    type: apigateway.JsonSchemaType.OBJECT,
  }
});

const errorResponseModel = new apigateway.Model(stack, 'ErrorResponseModel', {
  restApi: api,
  modelName: 'ErrorResponse',
  schema: {
    schema: apigateway.JsonSchemaVersion.DRAFT4,
    title: 'ErrorResponse',
    type: apigateway.JsonSchemaType.OBJECT,
    properties: {
      statusCode: { type: apigateway.JsonSchemaType.INTEGER },
      error: { type: apigateway.JsonSchemaType.STRING },
    },
  },
});

function convertNetworkErrorToIntegrationResponse(
  error: NetworkError
): apigateway.IntegrationResponse {
  const response: apigateway.IntegrationResponse = {
    selectionPattern: `.*${error.statusCode} - .*`,
    statusCode: error.statusCode.toString(),
    responseTemplates: {
      'application/json': "$input.path('$.errorMessage')",
    },
  };

  return response;
}

const ok: apigateway.IntegrationResponse = {
  statusCode: '200',
};

const integrationResponses: apigateway.IntegrationResponse[] = [
  NetworkError.BAD_REQUEST,
  NetworkError.UNPROCESSABLE_CONTENT,
].map(convertNetworkErrorToIntegrationResponse).concat(ok);

const methodResponses: MethodResponse[] = [
  {
    statusCode: '200',
    responseModels: {
      'application/json': okResponseModel,
    }
  },
  {
    statusCode: '400',
    responseModels: {
      'application/json': errorResponseModel,
    },
  },
  {
    statusCode: '422',
    responseModels: {
      'application/json': errorResponseModel,
    },
  },
];

const requestTemplate = `
#set($hasPathParams = $input.params().path.size() > 0)
{
  "request": {
    "body": $input.json('$'),
    #if($hasPathParams)
    "params": {
      #foreach($paramName in $input.params().path.keySet())
        "$paramName": "$util.escapeJavaScript($input.params().path.get($paramName))"
        #if($foreach.hasNext),#end
      #end
    },
    #end
  },
  "route": {
    "method": "$context.httpMethod",
    "path": "$context.resourcePath"
  }
}
`;

const productRequestModel = api.addModel('ProductRequestModel', {
  schema: {
    type: apigateway.JsonSchemaType.OBJECT,
    properties: {
      name: { type: apigateway.JsonSchemaType.STRING },
      price: { type: apigateway.JsonSchemaType.NUMBER, format: 'float' },
      totalQuantity: { type: apigateway.JsonSchemaType.INTEGER, format: 'int32' },
    },
    required: ['name', 'price', 'totalQuantity'],
  },
});

const resource = api.root.addResource('myresource');

const integration = new apigateway.LambdaIntegration(myLambda, {
  allowTestInvoke: true,
  proxy: false,
  integrationResponses: integrationResponses,
  passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
  requestTemplates: {
    'application/json': requestTemplate,
  },
});

const method = resource.addMethod("POST", integration, {
  methodResponses: methodResponses,
  requestModels: {
    "application/json": productRequestModel,
  },
  requestValidatorOptions: {
    validateRequestBody: true,
  }
});

resource.addMethod("GET", integration, {
  methodResponses: methodResponses,
});
