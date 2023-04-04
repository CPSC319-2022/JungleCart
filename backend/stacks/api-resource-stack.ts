import { Construct } from 'constructs';

import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { EnvironmentStack } from '../lib/environment-stack';
import { ServiceLambda } from '../lib/service-lambda';

import * as path from 'path';
import { ServiceStackProps } from '../lib/service-stack';
import * as cdk from 'aws-cdk-lib';
import { StepFunctionFacade } from '../lib/sfn/stepFunctionFacade';

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
    if (this.config.TYPE === 'LAMBDA') {
      this.initLayersForLambda();
      const lambda = this.initializeLambdas();
      const parentResource = this.config.resources;
      methods.forEach((method) => {
        api_service.addMethod(method, new apigateway.LambdaIntegration(lambda));
      });
      this.initializeSubResources(
        parentResource.resources,
        api_service,
        lambda
      );
    } else {
      const parentResource = this.config;
      this.initializeStepTrigger(parentResource, api_service);
    }
  }

  private initializeMultipleLambdas() {
    const helperLambdas = {};
    const lambdas = this.config.LAMBDAS;
    Object.entries(lambdas).forEach(([lambdaID, lambda]) => {
      const lambdaConfig = lambda as any;
      helperLambdas[lambdaID] = new ServiceLambda(this, lambdaConfig.ID, {
        dir: lambdaConfig.DIR,
        layers: this.getLayers(),
        environment: this.getLambdaEnvironment(),
      });
    });
    return helperLambdas;
  }

  private initializeStepTrigger(parentResource, api_service) {
    this.initLayersForLambdas();
    const lambdas = this.initializeMultipleLambdas();
    const steps = {};
    const stepConfigs = this.config.STEP;
    Object.entries(stepConfigs).forEach(([stepId, stepConfig]) => {
      const stepFunctionService = new StepFunctionFacade().createStepFunction(
        this,
        stepId,
        {
          config: { ...(stepConfig as any) },
          lambdas: lambdas,
        }
      );
      steps[stepId] = stepFunctionService;
    });

    const { override, methods } = parentResource.resources;
    const { DEFAULT } = parentResource;
    methods.forEach((method) => {
      if (
        !override ||
        !Object.prototype.hasOwnProperty.call(override, method)
      ) {
        api_service.addMethod(
          method,
          new apigateway.LambdaIntegration(lambdas[DEFAULT])
        );
      } else {
        const stepId = override[method];
        api_service.addMethod(
          method,
          apigateway.StepFunctionsIntegration.startExecution(
            steps[stepId[1]].getStateMachine()
          )
        );
      }
    });
    this.initializeStepSubResources(
      parentResource.resources.resources,
      api_service,
      lambdas,
      steps,
      DEFAULT
    );
  }

  private initializeStepSubResources(
    resources,
    parentResource,
    lambdas,
    steps,
    DEFAULT
  ) {
    if (!resources) {
      return;
    }
    resources.forEach(
      ({ override, base, methods, resources: subResources }) => {
        const subRoute = parentResource.addResource(base);
        methods.forEach((method) => {
          if (
            !override ||
            !Object.prototype.hasOwnProperty.call(override, method)
          ) {
            subRoute.addMethod(
              method,
              new apigateway.LambdaIntegration(lambdas[DEFAULT])
            );
          } else {
            const stepId = override[method];
            subRoute.addMethod(
              method,
              apigateway.StepFunctionsIntegration.startExecution(
                steps[stepId[1]].getStateMachine(),
                {
                  path: true,
                  querystring: true,
                  requestContext: {
                    httpMethod: true,
                    resourceId: true,
                    resourcePath: true,
                  },
                }
              )
            );
          }
        });
        this.initializeStepSubResources(
          subResources,
          subRoute,
          lambdas,
          steps,
          DEFAULT
        );
      }
    );
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

  private initLayersForLambdas(): void {
    const layerConfig = this.node.tryGetContext(this.node.tryGetContext('env'))[
      'layer-config'
    ];

    Object.entries(this.config.LAMBDAS).forEach(([, obj]) => {
      const lambda = obj as any;
      lambda.LAYERS.forEach((name: string) => {
        this.createLayer(name, layerConfig[name].DIR, layerConfig[name].ID);
      });
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

    this.config.LAMBDA &&
      this.config.LAMBDA.VARS?.forEach((layerName) => {
        Object.entries(lambdaENVConfig[layerName]).forEach(([key, value]) => {
          lambdaEnvironment[key] = value;
        });
      });
    return lambdaEnvironment;
  }
}
