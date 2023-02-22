import {Construct} from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";

export interface LambdaProps {
    readonly filename: string;
    readonly handler?: string;
    readonly dir?: string;
    readonly environment?: { [key: string]: string };
    readonly layers?: lambda.ILayerVersion[];
}

export class ServiceLambda extends lambda.Function {

    constructor(scope: Construct, id: string, props: LambdaProps) {
        const dir: string = props.dir ? props.dir : './dist/lambda/';
        const handler: string = props.handler ? props.handler : 'handler';

        super(scope, id, {
            code: lambda.Code.fromAsset(dir),
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: props.filename + '.' + handler,
            environment: props.environment,
            layers: props.layers,
        });
    }
}
