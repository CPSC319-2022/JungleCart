import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

import { EnvironmentStack } from './environment-stack';
export interface ServiceStackProps extends cdk.StackProps {
  readonly api?: boolean;
}

export class ServiceStack extends EnvironmentStack {
  protected readonly config;
  private layers: { [parameterName: string]: lambda.ILayerVersion } = {};
  private readonly api: boolean;

  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    // sets the config
    this.config = this.node.tryGetContext(this.node.tryGetContext('env'))[
      'services-config'
    ][id];

    this.api = props.api ? props.api : false;

    if (this.config.LAYERS) {
      this.config.LAYERS.forEach(
        (layer: { NAME: string; DIR: string; ID: string }) => {
          this.createLayer(layer.NAME, layer.DIR, layer.ID);
        }
      );
    }
  }

  protected createLayer(name: string, dir: string, id: string) {
    if (name in this.layers) return false;
    this.layers[name] = new lambda.LayerVersion(this, id, {
      code: lambda.Code.fromAsset(path.join('./dist/src/layer/', dir)),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    });
    return true;
  }

  protected getLayers(layerName?: string | string[]): lambda.ILayerVersion[] {
    if (!layerName) {
      return Object.values(this.layers);
    } else if (typeof layerName == 'string') {
      return [this.layers[layerName]];
    } else {
      return layerName.map((parameterName) => this.layers[parameterName]);
    }
  }
}
