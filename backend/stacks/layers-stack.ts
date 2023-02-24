import {Construct} from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";

import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export class LayersStack extends EnvironmentStack {

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
        super(scope, id, props);

        const sql_layer_config = this.node.tryGetContext(props.environment)['layer-config'].SQL_LAYER;

        // create layers
        const sql_layer = new lambda.LayerVersion(this, sql_layer_config.LAYER_ID, {
            code: lambda.Code.fromAsset('./dist/layer/sql-layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        new ssm.StringParameter(this, sql_layer_config.LAYER_NAME_PARAMETER_ID, {
            stringValue: sql_layer.layerVersionArn,
            parameterName: sql_layer_config.LAYER_NAME_PARAMETER_NAME
        });
    }
}
