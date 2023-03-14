import {Construct} from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from "aws-cdk-lib/aws-ssm";

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
    private readonly config;
    private readonly id;

    constructor(scope: Construct, id: string, props: LambdaProps) {
        const filename: string = props.filename ? props.filename : 'index';
        const handler: string = props.handler ? props.handler : 'handler';

        super(scope, id, {
            code: lambda.Code.fromAsset(path.join(scope.node.tryGetContext(
                scope.node.tryGetContext('env')
            )['lambda-config'].DIR, props.dir)),
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: filename + '.' + handler,
            environment: {...ServiceLambda.environmentVars, ...props.environment},
            layers: props.layers,
            functionName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });

        this.id = id;

        this.config = this.node.tryGetContext(
            this.node.tryGetContext('env')
        )['lambda-config'];
    }

    static addVar(name: string, value: string) {
        ServiceLambda.environmentVars[name] = value;
    }

    public exportToSSM(path: string, method: string | string[]) {
        this.saveId();
        this.saveArn();
        this.saveRoute(path.replace('/', '.'), method);
    }

    private paramIsSaved(id: string) {
        return this.node.children.map((child) => child.node.id).includes(id);
    }

    private saveId() {
        const parameterId = `${this.id}IdParameter`;

        if (this.paramIsSaved(parameterId)) return;

        new ssm.StringParameter(this, parameterId, {
            parameterName: this.config.PATH + this.config.ID_SUBPATH + `/${this.id}`,
            stringValue: this.id,
        });
    }

    private saveArn() {
        const parameterId = `${this.id}ArnParameter`;

        if (this.paramIsSaved(parameterId)) return;

        new ssm.StringParameter(this, parameterId, {
            parameterName: this.config.PATH + `/${this.id}` + this.config.ARN_SUBPATH,
            stringValue: this.functionArn,
        });
    }

    private readonly paths: Set<string> = new Set();
    private saveRoute(path: string, method: string | string []) {
        if (this.paths.has(path)) return;

        const value = typeof method == 'string' ? method : method.join('.');

        new ssm.StringParameter(this, `${this.id}Route${this.paths.size}Parameter`, {
            parameterName: `${this.config.PATH}/${this.id}${this.config.ROUTE_SUBPATH}/${this.paths.size}`,
            stringValue: `${path} ${value}`,
        });

        this.paths.add(path);
    }
}
