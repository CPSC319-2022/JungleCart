import {Construct} from 'constructs';
import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {EnvironmentStack} from "../lib/environment-stack";

export class ApiStack extends EnvironmentStack {
    private readonly _api;

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        this._api = new apigateway.RestApi(this, 'API', {
            description: 'Jungle Cart API',
            deployOptions: {
                stageName: 'dev',
            },
            // enable CORS
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    'Content-Type',
                    'X-Amz-Date',
                    'Authorization',
                    'X-Api-Key',
                ],
                allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowCredentials: true,
                allowOrigins: ['http://localhost:3000', "https://main.d80mxyatc2g3o.amplifyapp.com"],
            },
        });
    }

    public api() {
        return this._api;
    }
}
