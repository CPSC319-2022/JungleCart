import { ServiceStepFunction, ServiceStepFunctionProps } from "./service-step-function";
import { Construct } from "constructs";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { StateMachineType } from "aws-cdk-lib/aws-stepfunctions";
import * as logs from "aws-cdk-lib/aws-logs";

export class OrderUpdateSfn extends ServiceStepFunction {
  constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    super(scope, id, props);
  }

  createStateMachine() {
    const orderUpdateRequest = new sfn.Pass(this.scope, `${this.id}-` + "orderUpdateRequest", {
      parameters: {
        pathParameters: {
          "orderId.$": "$.path.orderId"
        },
        requestContext: {
          resourcePath: "/orders/{orderId}",
          httpMethod: "PUT"
        },
      },
      resultPath: "$"
    });

    const orders = new tasks.LambdaInvoke(this.scope,`${this.id}-`+ "updateOrder", {
      lambdaFunction: this.lambdas["OrdersLambda"],
      resultSelector: {
        "order.$": "States.StringToJson($.Payload.body)"
      },
      resultPath: "$"
    });

    const logGroup = new logs.LogGroup(this.scope, `${this.id}-`+  "MyLogGroup3");
    const stateMachine = new sfn.StateMachine(this.scope, this.id, {
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true
      },
      stateMachineType: StateMachineType.EXPRESS,
      definition: orderUpdateRequest.next(orders)
    });
    return stateMachine;
  }
}

