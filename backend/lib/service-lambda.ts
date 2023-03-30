import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export interface LambdaProps {
  readonly dir: string;
  readonly filename?: string;
  readonly handler?: string;
  readonly environment?: { [key: string]: string };
  readonly layers?: lambda.ILayerVersion[];
}

export class ServiceLambda extends lambda.Function {
  private static environmentVars: { [name: string]: string } = {};
  private readonly id;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    const filename: string = props.filename ? props.filename : 'index';
    const handler: string = props.handler ? props.handler : 'handler';

    super(scope, id, {
      code: lambda.Code.fromAsset(path.join('./dist/src/lambda/', props.dir)),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: filename + '.' + handler,
      environment: { ...ServiceLambda.environmentVars, ...props.environment },
      layers: props.layers,
      functionName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });

    this.id = id;
  }

  static addVar(name: string, value: string) {
    ServiceLambda.environmentVars[name] = value;
  }
}
