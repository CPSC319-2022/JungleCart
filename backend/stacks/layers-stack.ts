import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { EnvironmentStack } from '../lib/environment-stack';

export class LayersStack extends EnvironmentStack {
  readonly layers: { [name: string]: lambda.ILayerVersion } = {};

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const layer_config = this.node.tryGetContext(
      this.node.tryGetContext('env')
    )['layer-config'];

    const common = 'COMMON';
    this.layers[common] = new lambda.LayerVersion(
      this,
      layer_config[common].LAYER_ID,
      {
        code: lambda.Code.fromAsset('./dist/src/layer/common'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      }
    );

    const node_modulesLayer = 'NODE_MODULES_LAYER';
    this.layers[node_modulesLayer] = new lambda.LayerVersion(
      this,
      layer_config[node_modulesLayer].LAYER_ID,
      {
        code: lambda.Code.fromAsset('./dist/src/layer/nodejs'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      }
    );
  }
}
