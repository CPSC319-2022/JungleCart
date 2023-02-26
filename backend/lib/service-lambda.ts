import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

import * as path from "path";

export interface LambdaProps {
    readonly filename: string;
    readonly handler?: string;
    readonly dir?: string;
    readonly environment?: { [key: string]: string };
    readonly layers?: lambda.ILayerVersion[];
}

export class ServiceLambda extends lambda.Function {

    private static environmentVars: {[name: string]: string} = {};

    constructor(scope: Construct, id: string, props: LambdaProps) {
        const dir: string = props.dir ? props.dir : path.normalize('./dist/lambda/');
        const handler: string = props.handler ? props.handler : 'handler';

        super(scope, id, {
            code: lambda.Code.fromAsset(path.join(dir, props.filename)),
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: props.filename + '.' + handler,
            environment: {...ServiceLambda.environmentVars, ...props.environment},
            layers: props.layers,
            functionName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });
    }

    static addVar(name: string, value: string) {
        ServiceLambda.environmentVars[name] = value;
    }
}
