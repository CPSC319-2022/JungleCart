import {Construct} from 'constructs';

import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from 'aws-cdk-lib/aws-lambda';

import {EnvironmentStack} from "../lib/environment-stack";
import ssm = require('aws-sdk/clients/ssm');

export class ApiStack extends EnvironmentStack {
    private readonly config = this.node.tryGetContext(
        this.node.tryGetContext('env')
    )['lambda-config'];

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        this.getListOfLambdaParams()
            .then(async (listOfLambdaParams) => {
                console.log(listOfLambdaParams.length);
                if (listOfLambdaParams.length) {
                    const api = new apigateway.RestApi(this, this.config.GATEWAY, {
                        deployOptions: {
                            stageName: this.node.tryGetContext('env'), // dev or prod
                        }
                    });

                    await this.createApiRoutes(api, listOfLambdaParams);
                }
            });
    }

    private static async getParamValueFromPath(path: string): Promise<string[]> {
        const response = await new ssm().getParametersByPath({
            Path: path,
            Recursive: false,
            WithDecryption: false,
        }).promise();

        const parameterValues = response.Parameters?.map((param) => param.Value || '');

        return parameterValues || [];
    }

    private static getResourceForPath(api: apigateway.RestApi, path: string) {
        return path
            .split('.')
            .reduce((resource: apigateway.IResource, pathPart: string) => {
                // get resource for each pathPart or create it if not defined
                console.log(pathPart);
                return resource.getResource(pathPart) ?? resource.addResource(pathPart);
            }, api.root);
    }

    private async createApiRoutes(api: apigateway.RestApi, listOfLambdaParams: LambdaParam[]): Promise<void> {
        for (const lambdaParams of listOfLambdaParams) {
            const lambdaFunction = lambda.Function.fromFunctionArn(
                this,
                lambdaParams.id,
                lambdaParams.arn,
            );

            for (const route of lambdaParams.routes) {
                const resource = ApiStack.getResourceForPath(api, route.path);

                for (const httpMethod of route.methods) {
                    resource.addMethod(
                        httpMethod,
                        new apigateway.LambdaIntegration(lambdaFunction),
                    );
                }

                this.addCORSOptions(resource, route.methods);
            }
        }
    }

    private async getListOfLambdaParams(): Promise<LambdaParam[]> {
        const ids = await this.getLambdaFunctionIds();
        return await Promise.all(ids.map((id: string) => this.getLambdaParams(id)));
    }

    private async getLambdaFunctionIds(): Promise<string[]> {
        return ApiStack.getParamValueFromPath(
            `${this.config.PATH}${this.config.ID_SUBPATH}`
        );
    }

    private async getLambdaParams(id: string): Promise<LambdaParam> {
        const arn = await this.getLambdaFunctionArn(id);
        const pathAndMethods = await this.getLambdaFunctionPaths(id);
        const routes = pathAndMethods
            .map((pathAndMethod: string) => {
                const [path, methods] = pathAndMethod.split(' ');
                return {path, methods: methods.split('.')};
            });

        return {id, arn, routes};
    }

    private async getLambdaFunctionArn(id: string): Promise<string> {
        const response = await new ssm().getParameter({
            Name: this.config.PATH + `/${id}` + this.config.ARN_SUBPATH,
            WithDecryption: false,
        }).promise();

        return response.Parameter?.Value || '';
    }

    private async getLambdaFunctionPaths(id: string): Promise<string[]> {
        return ApiStack.getParamValueFromPath(
            `${this.config.PATH}/${id}${this.config.ROUTE_SUBPATH}`
        );
    }

    private addCORSOptions(apiResource: apigateway.IResource, methods: string[]) {
        const mockIntegrationForCORS = new apigateway.MockIntegration({
            integrationResponses: [{
                statusCode: '200',
                // in case of binary:
                // contentHandling: apigateway.ContentHandling.CONVERT_TO_TEXT,
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "false",
                    'method.response.header.Access-Control-Allow-Methods': `'${methods.join(',')}'`,
                }
            }],
            passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
            requestTemplates: {
                "application/json": "{\"statusCode\": 200}"
            }
        });

        const methodResponses: apigateway.MethodResponse[] = [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Headers': true,
                'method.response.header.Access-Control-Allow-Methods': true,
                'method.response.header.Access-Control-Allow-Credentials': true, // COGNITO
                'method.response.header.Access-Control-Allow-Origin': true,
            }

        }];

        apiResource.addMethod(
            'OPTIONS',
            mockIntegrationForCORS,
            {methodResponses: methodResponses},
        );
    }
}

type LambdaParam = {
    id: string;
    arn: string;
    routes: { path: string; methods: string[] }[]
}
