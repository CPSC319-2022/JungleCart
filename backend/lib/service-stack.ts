import {Construct} from 'constructs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

import {EnvironmentStack, EnvironmentStackProps} from "./environment-stack";

export interface ServiceStackProps extends EnvironmentStackProps {
    readonly layerConfigNames?: string[];
    readonly api?: boolean;
    readonly lambdaEnvironmentConfigNames?: string[];
}

export class ServiceStack extends EnvironmentStack {
    private static layers: { [parameterName: string]: lambda.ILayerVersion } = {};
    private readonly layersAdded: {[name: string]: lambda.ILayerVersion } = {};
    private static apiStackRef: apiGateway.IRestApi | undefined;
    private readonly api: boolean;
    protected lambda_environment: { [key: string]: string } = {};

    protected readonly config;

    constructor(scope: Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        const layerConfigNames = props.layerConfigNames ? props.layerConfigNames : [];

        layerConfigNames.forEach((layerConfigName) => {
            this.layersAdded[layerConfigName] = ServiceStack.layers[layerConfigName];
        });

        // sets the config if defined
        // throws error if not ;)
        this.config = this.node.tryGetContext(props.environment)['services-config'][id];

        // connects to api instance as defined by the api values in the config file
        if (props.api) {
            this.api = props.api;
        }

        // sets the lambda environment as defined by the lambda config file
        if (props.lambdaEnvironmentConfigNames) {
            this.setLambdaEnvironment(props.environment, props.lambdaEnvironmentConfigNames);
        }
    }

    private setLambdaEnvironment(environment: string, lambdaEnvironmentConfigNames: string[]) {
        lambdaEnvironmentConfigNames.forEach((lambdaEnvironmentConfigName) => {
            this.lambda_environment = {...this.lambda_environment, ...this.node.tryGetContext(environment)['lambda-config'][lambdaEnvironmentConfigName]};
        });
    }

    public static setApi(api: apiGateway.IRestApi) {
        ServiceStack.apiStackRef = api;
    }

    public static setLayers(layers: { [parameterName: string]: lambda.ILayerVersion }) {
        ServiceStack.layers = layers;
    }

    protected getLayers(layerName?: string | string[]): lambda.ILayerVersion[] {
        if (!layerName) {
            return Object.values(this.layersAdded);
        } else if (typeof layerName == 'string') {
            return [this.layersAdded[layerName]];
        } else {
            return layerName.map((parameterName) => this.layersAdded[parameterName]);
        }
    }

    protected addHttpMethod(path: string, method: string | string[], lambdaConstruct: lambda.Function): boolean {
        if (!ServiceStack.apiStackRef || !this.api) {
            return false;
        }

        // find the correct resource for path
        let resource: apiGateway.IResource = ServiceStack.apiStackRef.root;
        path.split('/')
            .forEach((pathPart) => {
                // get resource for each pathPart or create it if not defined
                const nextResource: apiGateway.IResource | undefined = resource.getResource(pathPart);
                resource = nextResource ? nextResource : resource.addResource(pathPart);
            });

        const addMethod = (method: string) => {
            resource.addMethod(
                method,
                new apiGateway.LambdaIntegration(lambdaConstruct),
            );
        };

        typeof method == "string" ? addMethod(method) : method.forEach((m) => addMethod(m));

        return true;
    }
}
