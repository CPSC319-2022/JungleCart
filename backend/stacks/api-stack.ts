import {Construct} from "constructs";

import * as api_gw from "aws-cdk-lib/aws-apigateway";

import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export interface ApiStackProps extends EnvironmentStackProps {
    methods?: string[];
}

export class ApiStack extends EnvironmentStack {

    public api: api_gw.RestApi;

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const config = this.node.tryGetContext(props.environment)['api-config'];

        const methods = props.methods ? props.methods : ['POST', 'GET', 'DELETE', 'PUT'];

        this.api = new api_gw.RestApi(this, config.REST_API_ID, {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: methods,
                allowCredentials: true,
            }
        });
    }
}
