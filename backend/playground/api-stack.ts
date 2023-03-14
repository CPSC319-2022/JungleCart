import {Construct} from 'constructs';

import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from 'aws-cdk-lib/aws-lambda';

import ssm = require('aws-sdk/clients/ssm');

import {EnvironmentStack, EnvironmentStackProps} from "../lib/environment-stack";

export class ApiStack extends EnvironmentStack {

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
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
            const lambdaArns = await this.getLambdaFunctionNames();

            let i = 0;
            for (const lambdaArn of lambdaArns) {
                api.root.addResource(String(i)).addMethod('GET', new apigateway.LambdaIntegration(lambda.Function.fromFunctionArn(this, String(i++), lambdaArn)));
            }
        })();
    }

    async getLambdaFunctionNames(): Promise<string[]> {
        const ssmClient = new ssm();

        const params = {
            Path: '/services/test',
            Recursive: false,
            WithDecryption: false,
        };

        const response = await ssmClient.getParametersByPath(params).promise();

        const functionNames = response.Parameters?.map((param) => param.Value || '');

        return functionNames || [];
    }
}
