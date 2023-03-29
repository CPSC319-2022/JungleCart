import { ServiceStepFunction, ServiceStepFunctionProps } from "./service-step-function";
import { Construct } from "constructs";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";

export class OrderStepFunctionFlow extends ServiceStepFunction {
  constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    super(scope, id, props);
  }

  createStateMachine() {
    const orders = new tasks.LambdaInvoke(this.scope, "OrdersLambda-sfn", {
      lambdaFunction: this.lambdas["OrdersLambda"]
    });

    const stateMachine = new stepfunctions.StateMachine(this.scope, this.id, {
      definition: orders.next(new stepfunctions.Succeed(this.scope, "GreetedWorld")),
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    });

    return stateMachine;
  }

}

