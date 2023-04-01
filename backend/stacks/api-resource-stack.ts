import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { EnvironmentStack } from '../lib/environment-stack';
import { ServiceLambda } from '../lib/service-lambda';

import * as path from 'path';
import { ServiceStackProps } from '../lib/service-stack';
import * as cdk from 'aws-cdk-lib';
import { StepFunctionFacade } from "../lib/sfn/stepFunctionFacade";

export type APIServiceProps = ServiceStackProps & {
  config;
  s3: cdk.aws_s3.Bucket;
};

export class APIService extends EnvironmentStack {
  private readonly API;
  private readonly config;
  private readonly layers = {};
  private readonly s3;

  constructor(scope: Construct, id: string, props: APIServiceProps) {
    super(scope, id, props);
    this.API = props.api;
    this.config = props.config;
    this.s3 = props.s3;
    this.initializeAPIResources();
  }

  private initializeAPIResources(): void {
    const resourcePath = this.config.resources.base;
    const methods = this.config.resources.methods;
    const api_service = this.API.root.addResource(resourcePath);

    // FIXME: remove hardcoded string
    if(this.config.entry === "LAMBDA") {
      this.initLayersForLambda();
      const lambda = this.initializeLambdas();
      const parentResource = this.config.resources;
      methods.forEach((method) => {
        api_service.addMethod(method, new apigateway.LambdaIntegration(lambda));
      });

      this.initializeSubResources(parentResource.resources, api_service, lambda);
    } else {
      this.initializeStepTrigger(api_service, methods);
    }
  }

  private initializeStepTrigger(api_service, methods) {
    const stepFunctionService = new StepFunctionFacade().createStepFunction(this, this.config.STEP.ID, {
      config: {...this.config.STEP}});

    methods.forEach((method) => {
      api_service.addMethod(
        method,
        apigateway.StepFunctionsIntegration.startExecution(stepFunctionService.getStateMachine()));
    });
  }



  private initializeSubResources(resources, parentResource, lambda) {
    if (!resources) {
      return;
    }
    resources.forEach(({ base, methods, resources: subResources }) => {
      const subRoute = parentResource.addResource(base);
      methods.forEach((method) => {
        subRoute.addMethod(method, new apigateway.LambdaIntegration(lambda));
      });
      this.initializeSubResources(subResources, subRoute, lambda);
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


  private initializeLambdas() {
    const lambda = new ServiceLambda(this, this.config.LAMBDA.ID, {
      dir: this.config.LAMBDA.DIR,
      layers: this.getLayers(),
      environment: this.getLambdaEnvironment(),
    });

    if (this.config.LAMBDA.ID === 'ProductsLambda') {
      this.s3.grantWrite(lambda);
    }

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
      return layerName.map((parameterName) => this.layers[parameterName]);
    }
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
