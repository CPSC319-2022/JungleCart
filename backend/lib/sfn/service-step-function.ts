import { Construct } from "constructs";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { ServiceLambda } from "../service-lambda";

export interface ServiceStepFunctionProps {
  config: any;
  lambdas: { [id: string]: ServiceLambda };
}

export abstract class ServiceStepFunction {
  _stateMachine: sfn.StateMachine;
  private readonly config;
  readonly lambdas: { [id: string]: ServiceLambda };
  scope: Construct;
  id: string;

  protected constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    this.config = props.config;
    this.scope = scope;
    this.id = id;
    this.lambdas = props.lambdas;
    this._stateMachine = this.createStateMachine();
  }

  public getStateMachine(): sfn.StateMachine {
    return this._stateMachine;
  }

  abstract createStateMachine(): sfn.StateMachine;
}

