import {
  ServiceStepFunction,
  ServiceStepFunctionProps,
} from '../service-step-function';
import { Construct } from 'constructs';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { StateMachineType } from 'aws-cdk-lib/aws-stepfunctions';
import * as logs from 'aws-cdk-lib/aws-logs';

export class OrderFetchSfn extends ServiceStepFunction {
  constructor(scope: Construct, id: string, props: ServiceStepFunctionProps) {
    super(scope, id, props);
  }

  createStateMachine() {
    const orders = new tasks.LambdaInvoke(this.scope, 'Create Pending Order', {
      lambdaFunction: this.lambdas['OrdersLambda'],
    });

    const cartRequest = new sfn.Pass(this.scope, 'cartRequest', {
      parameters: {
        pathParameters: {
          'userId.$': '$.path.userId',
        },
        requestContext: {
          resourcePath: '/carts/{userId}/items',
          httpMethod: 'GET',
        },
      },
      resultPath: '$',
    });

    const orderRequest = new sfn.Pass(this.scope, 'orderRequest', {
      parameters: {
        'body.$': '$.body',
        'pathParameters.$': '$.pathParameters',
        requestContext: {
          resourcePath: '/orders/users/{userId}',
          httpMethod: 'POST',
        },
      },
      resultPath: '$',
    });

    const getCart = new tasks.LambdaInvoke(this.scope, 'GetCart', {
      lambdaFunction: this.lambdas['CartsLambda'],
      resultSelector: {
        'cart.$': 'States.StringToJson($.Payload.body)',
      },
      resultPath: '$.body',
    });

    const logGroup = new logs.LogGroup(this.scope, 'MyLogGroup');
    const stateMachine = new sfn.StateMachine(this.scope, this.id, {
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
        includeExecutionData: true,
      },
      stateMachineType: StateMachineType.EXPRESS,
      definition: cartRequest.next(getCart).next(orderRequest).next(orders),
    });
    return stateMachine;
  }
}
