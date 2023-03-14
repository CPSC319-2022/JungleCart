import {Construct} from 'constructs';

import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from 'aws-cdk-lib/aws-lambda';

import {EnvironmentStack} from "../lib/environment-stack";
import ssm = require('aws-sdk/clients/ssm');

export class ApiStack extends EnvironmentStack {
    private readonly lambdaConfig = this.node.tryGetContext(
        this.node.tryGetContext('env')
    )['lambda-config'];
    private readonly ssmClient = new ssm();

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const api = new apigateway.RestApi(this, id + "Gateway", {
            defaultCorsPreflightOptions: {
                allowOrigins: [
                    'http://localhost:3000',
                    'https://main.d80mxyatc2g3o.amplifyapp.com/'
                ],
                allowMethods: ['POST', 'GET', 'DELETE', 'PUT'],
                allowCredentials: true,
            },
        });

        (async () => {
            const listOfLambdaParams = await this.getListOfLambdaParams();

            console.log(listOfLambdaParams);

            for (const lambdaParams of listOfLambdaParams) {
                const lambdaIntegration = new apigateway.LambdaIntegration(
                    lambda.Function.fromFunctionArn(
                        this,
                        lambdaParams.id,
                        lambdaParams.arn)
                );

                for (const route of lambdaParams.routes) {
                    // find the correct resource for path
                    let resource: apigateway.IResource = api.root;
                    route.path.split('.').forEach((pathPart) => {
                        // get resource for each pathPart or create it if not defined
                        const nextResource: apigateway.IResource | undefined =
                            resource.getResource(pathPart);
                        resource = nextResource ? nextResource : resource.addResource(pathPart);
                    });

                    for (const method of route.methods) {
                        resource.addMethod(
                            method,
                            lambdaIntegration,
                        );
                    }
                }
            }
        })();
    }

    async getParamValueFromPath(path: string) {
        const response = await this.ssmClient.getParametersByPath({
            Path: path,
            Recursive: false,
            WithDecryption: false,
        }).promise();

        const parameterValues = response.Parameters?.map((param) => param.Value || '');

        return parameterValues || [];
    }

    async getLambdaFunctionArn(id: string): Promise<string> {
        const response = await this.ssmClient.getParameter({
            Name: this.lambdaConfig.PATH + `/${id}` + this.lambdaConfig.ARN_SUBPATH,
            WithDecryption: false,
        }).promise();

        return response.Parameter?.Value || '';
    }

    async getLambdaFunctionIds(): Promise<string[]> {
        return this.getParamValueFromPath(this.lambdaConfig.PATH + this.lambdaConfig.ID_SUBPATH);
    }

    async getLambdaFunctionPaths(id: string): Promise<string[]> {
        return this.getParamValueFromPath(this.lambdaConfig.PATH + `/${id}` + this.lambdaConfig.ROUTE_SUBPATH);
    }

    async getLambdaParams(id: string): Promise<LambdaParam> {
        const arn = await this.getLambdaFunctionArn(id);
        const routes = await this.getLambdaFunctionPaths(id)
            .then((listOfPathsAndMethods) => listOfPathsAndMethods
                .map((pathAndMethods: string) => {
                    return {
                        path: pathAndMethods.split(' ')[0],
                        methods: pathAndMethods.split(' ')[1].split('.'),
                    };
                })
            );

        return {
            id: id,
            arn: arn,
            routes: routes,
        };
    }

    async getListOfLambdaParams(): Promise<LambdaParam[]> {
        const ids = await this.getLambdaFunctionIds();

        return Promise.all(ids.map((id: string) => this.getLambdaParams(id)));
    }
}

type LambdaParam = {
    id: string;
    arn: string;
    routes: { path: string; methods: string[] }[]
}
