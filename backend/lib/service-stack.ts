import {Construct} from 'constructs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as ssm from "aws-cdk-lib/aws-ssm";

import {EnvironmentStack, EnvironmentStackProps} from "./environment-stack";
import {ILayerVersion} from "aws-cdk-lib/aws-lambda";

export interface ServiceStackProps extends EnvironmentStackProps {
    readonly restApiId: string;
    readonly rootResourceId: string;
    readonly layerArns?: [parameterName: string];
}

export class ServiceStack extends EnvironmentStack {
    private readonly layers: {[parameterName: string]: lambda.ILayerVersion} = {};
    private readonly api: apiGateway.IRestApi;

    constructor(scope: Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        const layerArns = props.layerArns ? props.layerArns : [];

        layerArns.forEach((param) => {
            // todo remove
            console.log(param);
            const arn = ssm.StringParameter.fromStringParameterAttributes(this, 'imported' + param, {
                parameterName: param
            }).stringValue;
            this.layers[param] = lambda.LayerVersion.fromLayerVersionArn(this, id + param + "Layer", arn);
        });

        this.api = apiGateway.RestApi.fromRestApiAttributes(this, id + 'ApiGateway', {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });
    }

    protected getLayers(layerName?: string | string[]): ILayerVersion[] {
        if (!layerName) {
            return Object.values(this.layers);
        } else if (typeof layerName == 'string') {
            return [this.layers[layerName]];
        } else {
            return layerName.map((parameterName) => this.layers[parameterName]);
        }
    }

    protected addHttpMethod(path: string, method: string | string[], lambdaConstruct: lambda.Function) {
        let baseResource: apiGateway.IResource = this.api.root;
        const resourcePaths: string[] = path.split('/');
        console.log(resourcePaths);
        resourcePaths.slice(0, -1).forEach((pathPart) => {
            const nextResource: apiGateway.IResource | undefined = baseResource.getResource(pathPart);
            baseResource = nextResource ? nextResource : baseResource;
        });
        const resource = this.api.root.addResource(resourcePaths.slice(-1)[0]);

        const addMethod = (method: string) => {
            resource.addMethod(
                method,
                new apiGateway.LambdaIntegration(lambdaConstruct),
            );
        };

        typeof method == "string" ? addMethod(method) : method.forEach((m) => addMethod(m));
    }
}
