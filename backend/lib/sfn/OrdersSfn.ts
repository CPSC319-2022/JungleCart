import {
  ServiceStepFunction,
  ServiceStepFunctionProps,
} from '../service-step-function';
import { Construct } from 'constructs';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import * as logs from 'aws-cdk-lib/aws-logs';
import { StepFunctionFacade } from './stepFunctionFacade';

export class OrdersSfn extends ServiceStepFunction {
  private props;
  constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    super(scope, id, props);
    this.props = props;
  }
  updateStepFunction() {
    const orderUpdate = new StepFunctionFacade().createStepFunction(
      this.scope,
      'OrderUpdateSfn',
      {
        config: this.config,
        lambdas: this.lambdas,
      }
    );

    const task = new tasks.StepFunctionsStartExecution(
      this.scope,
      'ModifyOrder',
      {
        stateMachine: orderUpdate.getStateMachine(),
        integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
      }
    );

    return task;
  }

  createStateMachine() {
    const orderValidationRequest = new sfn.Pass(
      this.scope,
      `${this.id}-` + 'validate-order',
      {
        parameters: {
          pathParameters: {
            'orderId.$': '$.path.orderId',
          },
          requestContext: {
            resourcePath: '/orders/{orderId}',
            httpMethod: 'GET',
          },
          'request.$': '$.requestContext.httpMethod',
        },
        resultPath: '$',
      }
    );

    const orderMapper = new sfn.Choice(this.scope, `${this.id}-` + 'request');
    // const getOrderReq = sfn.Condition.stringEquals('$.requestContext.httpMethod', 'PUT');
    const placeOrderReq = sfn.Condition.stringEquals(
      '$.requestContext.httpMethod',
      'POST'
    );

    const orders = new tasks.LambdaInvoke(
      this.scope,
      `${this.id}-` + 'getOrder',
      {
        lambdaFunction: this.lambdas['OrdersLambda'],
        resultSelector: {
          'order.$': 'States.StringToJson($.Payload.body)',
        },
        resultPath: '$',
      }
    );

    const choice = new sfn.Choice(this.scope, 'Is Order Pending?');
    const orderStatusCheck = sfn.Condition.stringEquals(
      '$.order.status_label',
      'pending'
    );

    const paymentRequest = new sfn.Pass(
      this.scope,
      `${this.id}-` + 'paymentCheck',
      {
        parameters: {
          'order.$': '$.order',
          pathParameters: {
            'orderId.$': '$.order.id',
            'buyerId.$': '$.order.buyer_info.id',
          },
          requestContext: {
            resourcePath: '/orders/{buyerId}/payment',
            httpMethod: 'GET',
          },
        },
        resultPath: '$',
      }
    );

    const payment = new tasks.LambdaInvoke(
      this.scope,
      `${this.id}-` + 'validatePayment',
      {
        lambdaFunction: this.lambdas['PaymentLambda'],
        resultSelector: {
          'order2.$': 'States.StringToJson($.Payload.body)',
        },
        resultPath: '$.body',
      }
    );

    const orderRequest = new sfn.Pass(
      this.scope,
      `${this.id}-` + 'orderRequest',
      {
        parameters: {
          'body.$': '$.body',
          'pathParameters.$': '$.pathParameters',
          requestContext: {
            resourcePath: '/orders/{orderId}',
            httpMethod: 'POST',
          },
        },
        resultPath: '$',
      }
    );

    const orderPlacement = new tasks.LambdaInvoke(this.scope, 'place order', {
      lambdaFunction: this.lambdas['OrdersLambda'],
      resultSelector: {
        'order.$': 'States.StringToJson($.Payload.body)',
      },
      resultPath: '$',
    });

    const orderFail = new sfn.Fail(this.scope, 'order inactive', {
      error: 'WorkflowFailure',
      cause: 'Something went wrong',
    });
    const logGroup = new logs.LogGroup(
      this.scope,
      `${this.id}-` + 'MyLogGroup'
    );
    const updateStep = this.updateStepFunction();
    const stateMachine = new sfn.StateMachine(this.scope, this.id, {
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      },
      stateMachineType: StateMachineType.EXPRESS,
      definition: orderMapper
        .when(
          placeOrderReq,
          orderValidationRequest
            .next(orders)
            .next(
              choice
                .when(
                  orderStatusCheck,
                  paymentRequest
                    .next(payment)
                    .next(orderRequest)
                    .next(orderPlacement)
                )
                .otherwise(orderFail)
            )
        )
        .otherwise(updateStep),
    });
    return stateMachine;
  }
}
