import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as api_gw from "aws-cdk-lib/aws-apigateway";

import {LambdaConstruct} from "./lambda-construct";

export interface ApiProps {
    methods?: string[];
}

export class ApiConstruct extends Construct {

    private api: api_gw.RestApi;

    constructor(scope: Construct, id: string, props: ApiProps) {
        super(scope, id)

        const methods = props.methods ? props.methods : ['POST', 'GET', 'DELETE'];

        this.api = new api_gw.RestApi(this, id, {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: methods,
            }
        });

        new cdk.CfnOutput(this, 'api-url', {value: this.api.url});
    }

    public registerLambda(path_part: string, method: string, lambdaConstruct: LambdaConstruct) {
        const resource = this.api.root.addResource(path_part);

        resource.addMethod(
            method,
            new api_gw.LambdaIntegration(lambdaConstruct.getLambda()),
        );
    }
}
