import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as api_gw from "aws-cdk-lib/aws-apigateway";
import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export interface ApiStackProps extends EnvironmentStackProps {
    methods?: string[];
}

export class ApiStack extends EnvironmentStack {

    private api: api_gw.RestApi;

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const methods = props.methods ? props.methods : ['POST', 'GET', 'DELETE', 'PUT'];

        this.api = new api_gw.RestApi(this, "RestApiGateway", {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: methods,
                allowCredentials: true,
            }
        });

        new cdk.CfnOutput(this, 'RestApiId', {
            exportName: 'restApiId',
            value: this.api.restApiId,
        });

        new cdk.CfnOutput(this, 'RootResourceId', {
            exportName: 'rootResourceId',
            value: this.api.restApiRootResourceId,
        });
    }
}
