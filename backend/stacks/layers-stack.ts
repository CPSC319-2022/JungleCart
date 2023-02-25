import {Construct} from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ssm from "aws-cdk-lib/aws-ssm";

import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export class LayersStack extends EnvironmentStack {

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
        super(scope, id, props);

        const layer_config = this.node.tryGetContext(props.environment)['layer-config'].SQL_LAYER;

        // SQL_LAYER
        const sql_layer = new lambda.LayerVersion(this, layer_config.SQL_LAYER.LAYER_ID, {
            code: lambda.Code.fromAsset('./dist/layer/sql-layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        new ssm.StringParameter(this, layer_config.SQL_LAYER.LAYER_VERSION_ARN['@PARAM'].ID, {
            stringValue: sql_layer.layerVersionArn,
            parameterName: layer_config.SQL_LAYER.LAYER_VERSION_ARN['@PARAM'].NAME
        });
    }
}
