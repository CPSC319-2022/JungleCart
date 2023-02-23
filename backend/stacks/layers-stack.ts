import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

export type LayersStackProps = cdk.StackProps;

export class LayersStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: LayersStackProps) {
        super(scope, id, props);

        // create layers
        const sql_layer = new lambda.LayerVersion(this, 'SqlLayer', {
            code: lambda.Code.fromAsset('./dist/layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        // output arn values
        new cdk.CfnOutput(this, 'SqlLayerArn', {
            exportName: 'sqlLayerArn',
            value: sql_layer.layerVersionArn,
        });
    }
}
