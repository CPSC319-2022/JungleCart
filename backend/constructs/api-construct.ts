import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as api_gw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface ApiProps {
    methods?: string[];
}

export class ApiConstruct extends Construct {

    private api: api_gw.RestApi;

    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id)

        const methods = props.methods ? props.methods : ['POST', 'GET', 'DELETE', 'PUT'];

        this.api = new api_gw.RestApi(this, id, {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: methods,
                allowCredentials: true,
            }
        });

        new cdk.CfnOutput(this, 'api-url', {value: this.api.url});
    }

    public registerMethod(path: string, method: string | string[], lambdaConstruct: lambda.Function) {
        const resource = this.api.root.addResource(path);

        const addMethod = (method: string) => {
            resource.addMethod(
                method,
                new api_gw.LambdaIntegration(lambdaConstruct),
            );
        };

        typeof method == "string" ? addMethod(method) : method.forEach((m) => addMethod(m));
    }
}
