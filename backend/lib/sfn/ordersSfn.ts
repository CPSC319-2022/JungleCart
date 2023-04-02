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
      lambdaFunction: this.lambdas["OrdersLambda"],
      resultPath: "$.output"
    });

    const userRequest = new stepfunctions.Pass(this.scope, 'user parse', {
      parameters: {
          pathParameters: {
            "userId.$": "$.pathParameters.userId"
          },
          requestContext: {
            resourcePath: "/users/{userId}",
            httpMethod: "GET"
          }
        },
      resultPath: '$',
    });


    const getUser = new tasks.LambdaInvoke(this.scope, 'GetUser', {
      lambdaFunction: this.lambdas["UsersLambda"],
      resultSelector: {
        "user.$": "States.StringToJson($.Payload.body)"
      },
      resultPath: "$.response.user",
      // Use "guid" field as input
      outputPath: '$.Payload',
    });

    const cartRequest = new stepfunctions.Pass(this.scope, 'cartRequest', {
      parameters: {
          pathParameters: {
            "userId.$": "$.pathParameters.userId"
          },
          requestContext: {
            resourcePath: "/carts/{userId}/items",
            httpMethod: "GET"
          }
      },
      resultPath: '$',
    });


    const getCart = new tasks.LambdaInvoke(this.scope, 'GetCart', {
      lambdaFunction: this.lambdas["CartsLambda"],
      resultSelector: {
        "cart.$": "States.StringToJson($.Payload.body)"
      },
      resultPath: "$.response.cart",
    });


    const stateMachine = new stepfunctions.StateMachine(this.scope, this.id, {
      definition:
        userRequest.next(getUser).next(cartRequest).next(getCart).next(orders),
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    });

    return stateMachine;
  }

}

