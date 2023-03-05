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
    console.log(this.layers);

    // QUERYBUILDER_LAYER
    const queryBuilderLayer = 'QUERYBUILDER_LAYER';
    this.layers[queryBuilderLayer] = new lambda.LayerVersion(
      this,
      layer_config[queryBuilderLayer].LAYER_ID,
      {
        code: lambda.Code.fromAsset('./dist/layer/queryBuilder-layer'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      }
    );

    // ASYNCWRAP_LAYER
    const asyncWrapLayer = 'ASYNCWRAP_LAYER';
    this.layers[asyncWrapLayer] = new lambda.LayerVersion(
      this,
      layer_config[asyncWrapLayer].LAYER_ID,
      {
        code: lambda.Code.fromAsset('./dist/layer/asyncWrap-layer'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      }
    );

    // customError_LAYER
    const customErrorLayer = 'CUSTOMERROR_LAYER';
    this.layers[customErrorLayer] = new lambda.LayerVersion(
      this,
      layer_config[customErrorLayer].LAYER_ID,
      {
        code: lambda.Code.fromAsset('./dist/layer/customError-layer'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      }
    );
    console.log(this.layers);
  }
}