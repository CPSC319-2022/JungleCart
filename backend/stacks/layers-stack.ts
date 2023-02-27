import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';

import {
  EnvironmentStackProps,
  EnvironmentStack,
} from '../lib/environment-stack';

export class LayersStack extends EnvironmentStack {
  readonly layers: { [name: string]: lambda.ILayerVersion } = {};

  constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
    super(scope, id, props);

    const layer_config = this.node.tryGetContext(props.environment)[
      'layer-config'
    ];

    // SQL_LAYER
    const sqlLayer = 'SQL_LAYER';
    this.layers[sqlLayer] = new lambda.LayerVersion(
      this,
      layer_config[sqlLayer].LAYER_ID,
      {
        code: lambda.Code.fromAsset('./dist/layer/sql-layer'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      }
    );

    // USER_LAYER
    const userLayer = 'USER_LAYER';
    this.layers[userLayer] = new lambda.LayerVersion(
      this,
      layer_config[userLayer].LAYER_ID,
      {
        code: lambda.Code.fromAsset('./dist/layer/user-layer'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      }
    );

    console.log(this.layers);
  }
}
