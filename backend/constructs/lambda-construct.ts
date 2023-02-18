import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface LambdaProps {
    readonly filename: string;
    readonly handler?: string;
    readonly dir?: string;
    readonly environment?: { [key: string]: string };
    readonly layers?: lambda.ILayerVersion[];
}

export class LambdaConstruct extends Construct {

    private readonly func: lambda.Function;

    constructor(scope: Construct, id: string, props: LambdaProps) {
        super(scope, id);

        const dir: string = props.dir ? props.dir : 'lambda';
        const handler: string = props.handler ? props.handler : 'handler';

        this.func = new lambda.Function(this, id, {
            code: lambda.Code.fromAsset(dir),
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: props.filename + '.' + handler,
            environment: props.environment,
        });
    }

    public getLambda() {
        return this.func;
    }
}
