import {Construct} from 'constructs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

import {EnvironmentStack, EnvironmentStackProps} from "./environment-stack";

export interface ServiceStackProps extends EnvironmentStackProps {
    readonly restApiId: string;
    readonly rootResourceId: string;
    readonly layerArns?: [[id: string, arn: string]];
}

export class ServiceStack extends EnvironmentStack {
    protected readonly layers: lambda.ILayerVersion[];
    private readonly api: apiGateway.IRestApi;

    constructor(scope: Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        const layerArns = props.layerArns ? props.layerArns : [];

        this.layers = layerArns.map(([id, arn]) => {
            return lambda.LayerVersion.fromLayerVersionArn(this, id, arn);
        });

        this.api = apiGateway.RestApi.fromRestApiAttributes(this, 'ProductsApiGateway', {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });
    }

    addHttpMethod(path: string, method: string | string[], lambdaConstruct: lambda.Function) {
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
