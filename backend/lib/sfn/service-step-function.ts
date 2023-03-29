import { Construct } from "constructs";
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import { ServiceLambda } from "../service-lambda";

export interface ServiceStepFunctionProps {
  config: any;
}

export abstract class ServiceStepFunction {
  _stateMachine: stepfunctions.StateMachine;
  private readonly config;
  readonly lambdas: {[id: string]: ServiceLambda};
  scope: Construct;
  id: string;

  protected constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    this.config = props.config;
    this.scope = scope;
    this.id = id;
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

      });

    });
    return helperLambdas;
  }



  public getStateMachine(): stepfunctions.StateMachine {
    return this._stateMachine;
  }

  abstract createStateMachine(): stepfunctions.StateMachine;

}

