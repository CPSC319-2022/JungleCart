import { Construct } from 'constructs';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { EnvironmentStack } from "../lib/environment-stack";
import { ServiceLambda } from "../lib/service-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'path';
export type APIServiceProps =  any;

export class APIService extends EnvironmentStack {
  private readonly API;
  private readonly config;
  private readonly layers = {};
  constructor(scope: Construct, id: string, props: APIServiceProps) {
    super(scope, id, props);
    this.API = props.api;
    this.config = props;
    this.createLayer("COMMON","COMMON", "COMMON");
    this.createLayer("NODE_MODULES_LAYER","nodejs", "node_modules");

    if (this.config.LAYERS) {
      this.config.LAYERS.forEach(
        (layer: { NAME: string; DIR: string; ID: string }) => {
          this.createLayer(layer.NAME, layer.DIR, layer.ID);
        }
      );
    }
    this.initializeAPIResources();
  }

  private  initializeAPIResources(): void {
    const lambda = this.initializeLambdas();
    const resourcePath = this.config.ENDPOINTS.base;
    const methods = this.config.ENDPOINTS.methods;
    const api_service = this.API.root.addResource(resourcePath);

    methods.forEach((method) => {
      api_service.addMethod(method, new apigateway.LambdaIntegration(lambda));
    });

    this.setStatusCheck(api_service);
  }

  private setStatusCheck(api_service) {
    const lambda = new ServiceLambda(this, 'status', {
      dir: "status",
      layers: [],
      environment: {},
    });
    const resourcePath = 'status';
    api_service.addResource(resourcePath).addMethod("GET", new apigateway.LambdaIntegration(lambda));
  }

  private initializeLambdas() {
    const lambda = new ServiceLambda(this, this.config.LAMBDA.LAMBDA_ID, {
      dir: this.config.LAMBDA.LAMBDA_DIR,
      layers: this.getLayers(this.config.LAMBDA.LAYERS),
      environment: {},
    });
    return lambda;
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
      return  layerName.map((parameterName) => this.layers[parameterName]);
    }
  }
}
