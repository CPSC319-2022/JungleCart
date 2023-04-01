import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';

import { ServiceLambda } from '../lib/service-lambda';
import * as path from 'path';
import { ServiceStack, ServiceStackProps} from '../lib/service-stack';
import { EnvironmentStack } from '../lib/environment-stack';


export type ShippingStackProps = ServiceStackProps;

export class ShippingStack extends EnvironmentStack {
  private config;
  private layers = {};
  constructor(scope: Construct, id: string, props: ShippingStackProps) {
        super(scope, id, props);
        this.config = props;
        this.initLayersForLambda();
        console.log(this.getLayers());
        const shipping_lambda = new ServiceLambda(this, this.config.LAMBDA.ID, {
            dir: 'shipping-lambda',
            // you can also just use this.getLayers() which will return all layers
            // the layers that you can get are added when you initialize the stack in src/app.ts
            layers: this.getLayers(),
            // if you want to add more values use {...this.lambda_environment, "YOUR_VAR_NAME": "YOUR_VAR_VALUE" }
            // you can also create your own environment in the config/lambda.json
            // and simply pass the environment name when you initialize the stack in src/app.ts
            environment: this.getLambdaEnvironment()
        });
        
    }
    
    private initLayersForLambda(): void {
      const layerConfig = this.node.tryGetContext(this.node.tryGetContext('env'))[
        'layer-config'
      ];
  
      this.config.LAMBDA.LAYERS?.forEach((name: string) => {
        this.createLayer(name, layerConfig[name].DIR, layerConfig[name].ID);
      });
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
  protected createLayer(name: string, dir: string, id: string) {
    if (name in this.layers) return false;
    this.layers[name] = new lambda.LayerVersion(this, id, {
      code: lambda.Code.fromAsset(path.join('./dist/src/layer/', dir)),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    });
    return true;
  }

    protected getLambdaEnvironment(): { [key: string]: string } {
        const lambdaENVConfig = this.node.tryGetContext(
          this.node.tryGetContext('env')
        )['lambda-env-config'];
    
        const lambdaEnvironment = {};
        this.config.LAMBDA.VARS?.forEach((layerName) => {
          Object.entries(lambdaENVConfig[layerName]).forEach(([key, value]) => {
            lambdaEnvironment[key] = value;
          });
        });
        return lambdaEnvironment;
      }
}
