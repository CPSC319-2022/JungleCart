import { Construct } from "constructs";
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import { ServiceLambda } from "../service-lambda";
import { EnvironmentStack } from "../environment-stack";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export interface ServiceStepFunctionProps {
  config: any;
}

export abstract class ServiceStepFunction extends EnvironmentStack{
  _stateMachine: stepfunctions.StateMachine;
  private readonly config;
  readonly lambdas: {[id: string]: ServiceLambda};
  scope: Construct;
  id: string;
  private layers = {};

  protected constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    super(scope, id+"_wrapper",{});
    this.config = props.config;
    this.scope = scope;
    this.id = id;
    this.initLayersForLambda();
    this.lambdas = this.initializeLambdas();
    this._stateMachine = this.createStateMachine();
  }

  private initializeLambdas() {
    const helperLambdas = {};
    const lambdas = this.config.LAMBDAS;
    Object.entries(lambdas).forEach(([lambdaID, lambda]) => {
      const lambdaConfig = lambda as any;
      helperLambdas[lambdaID] = new ServiceLambda(this.scope, lambdaConfig.ID, {
        dir: lambdaConfig.DIR,
        layers: this.getLayers(),
        environment: this.getLambdaEnvironment()
      });

    });
    return helperLambdas;
  }

  public getStateMachine(): stepfunctions.StateMachine {
    return this._stateMachine;
  }

  abstract createStateMachine(): stepfunctions.StateMachine;

  private initLayersForLambda(): void {
    const layerConfig = this.node.tryGetContext(this.node.tryGetContext('env'))[
      'layer-config'
      ];
    this.config.LAYERS?.forEach((name: string) => {
      this.createLayer(name, layerConfig[name].DIR, layerConfig[name].ID);
    });
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

  private getLambdaEnvironment(): { [key: string]: string } {
    // const lambdaENVConfig = this.node.tryGetContext(
    //   this.node.tryGetContext('env')
    // )['lambda-env-config'];

    const lambdaEnvironment = {};
    // this.config.LAMBDA.VARS?.forEach((layerName) => {
    //   Object.entries(lambdaENVConfig[layerName]).forEach(([key, value]) => {
    //     lambdaEnvironment[key] = value;
    //   });
    // });
    return lambdaEnvironment;
  }


}

