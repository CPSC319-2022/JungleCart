import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export class LayersStack extends EnvironmentStack {

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
        super(scope, id, props);

        // create layers
        const sql_layer = new lambda.LayerVersion(this, 'SqlLayer', {
            code: lambda.Code.fromAsset('./dist/layer/sql-layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        // output arn values
        new cdk.CfnOutput(this, 'SqlLayerArn', {
            exportName: 'sqlLayerArn',
            value: sql_layer.layerVersionArn,
        });
    }
}
