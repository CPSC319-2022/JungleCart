import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'
import { ApiConstruct } from '../constructs/api-construct'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { ServiceLambda } from '../constructs/service-lambda'

export interface CartsStackProps extends cdk.NestedStackProps {
  readonly api: ApiConstruct
  readonly layers: lambda.ILayerVersion[]
  readonly environment: { [key: string]: string }
}

export class CartsStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props: CartsStackProps) {
    super(scope, id, props)

    const carts_lambda = new ServiceLambda(this, 'CartsLambda', {
      filename: 'carts-lambda',
      layers: props.layers,
      environment: props.environment,
    })

    // /carts/:userId/items
    const carts_path = props.api.registerMethod(
      'carts/:userId/items',
      ['GET', 'PUT', 'POST'],
      carts_lambda
    )

    // /carts/:userId/items/:id
    props.api.registerMethod(':id', ['DELETE'], carts_lambda, carts_path)
  }
}
