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

        const api = new apigateway.RestApi(this, this.config.GATEWAY, {
            defaultCorsPreflightOptions: {
                allowOrigins: [
                    'http://localhost:3000',
                    'https://main.d80mxyatc2g3o.amplifyapp.com/'
                ],
                allowMethods: ['POST', 'GET', 'DELETE', 'PUT'],
                allowCredentials: true,
            },
        });

        this.createApiRoutes(api);
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
                return resource.getResource(pathPart) ?? resource.addResource(pathPart);
            }, api.root);
    }

    private async createApiRoutes(api: apigateway.RestApi): Promise<void> {
        const listOfLambdaParams = await this.getListOfLambdaParams();

        for (const lambdaParams of listOfLambdaParams) {
            const lambdaFunction = lambda.Function.fromFunctionArn(
                this,
                lambdaParams.id,
                lambdaParams.arn
            );

            for (const route of lambdaParams.routes) {
                const resource = ApiStack.getResourceForPath(api, route.path);

                for (const method of route.methods) {
                    resource.addMethod(
                        method,
                        new apigateway.LambdaIntegration(lambdaFunction),
                    );
                }
            }
        }
    }

    private async getListOfLambdaParams(): Promise<LambdaParam[]> {
        const ids = await this.getLambdaFunctionIds();
        return Promise.all(ids.map((id: string) => this.getLambdaParams(id)));
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
}

type LambdaParam = {
    id: string;
    arn: string;
    routes: { path: string; methods: string[] }[]
}
