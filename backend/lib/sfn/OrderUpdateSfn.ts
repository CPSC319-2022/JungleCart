import { ServiceStepFunction, ServiceStepFunctionProps } from "../service-step-function";
import { Construct } from "constructs";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { StateMachineType } from "aws-cdk-lib/aws-stepfunctions";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";


export class OrderUpdateSfn extends ServiceStepFunction {
  constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    super(scope, id, props);
  }

  createStateMachine() {
    const orderUpdateRequest = new sfn.Pass(this.scope, "Order Update Request", {
      parameters: {
        "body.$": "$.body",
        pathParameters: {
          "orderId.$": "$.pathParameters.orderId"
        },
        requestContext: {
          resourcePath: "/orders/{orderId}",
          httpMethod: "PUT"
        },
      },
      resultPath: "$"
    });

    const orders = new tasks.LambdaInvoke(this.scope,`${this.id}-`+ "update Order", {
      lambdaFunction: this.lambdas["OrdersLambda"],
      // resultSelector: {
      //   "order.$": "States.StringToJson($.Payload.body)"
      // },
      resultPath: "$.input"
    });

    this.lambdas["ShippingLambda"].addToRolePolicy(new iam.PolicyStatement({
      actions: ['ses:SendEmail', 'SES:SendRawEmail'],
      resources: ['*'],
      effect: iam.Effect.ALLOW,
    }));

    const shippingReq = new sfn.Pass(this.scope, `${this.id}-` + "email request", {
      parameters: {
        "body": {
          "order": {"id.$" :  "$.pathParameters.orderId"}
        }
      },
      resultPath: "$"
    });


    const shipping = new tasks.LambdaInvoke(this.scope,`${this.id}-`+ "send email", {
      lambdaFunction: this.lambdas["ShippingLambda"],
      // resultSelector: {
      //   "order.$": "States.StringToJson($.Payload.body)"
      // },
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
      definition: orderUpdateRequest.next(orders).next(shippingReq).next(shipping)
    });
    return stateMachine;
  }
}

