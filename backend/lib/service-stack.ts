import {Construct} from 'constructs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

import {EnvironmentStack, EnvironmentStackProps} from "./environment-stack";
import {convertParamsToContext} from "./configuration-parser";

export interface ServiceStackProps extends EnvironmentStackProps {
    readonly layerConfigNames?: string[];
    readonly api?: boolean;
    readonly lambdaEnvironmentConfigNames?: string[];
}

export class ServiceStack extends EnvironmentStack {
    private readonly layers: { [parameterName: string]: lambda.ILayerVersion } = {};
    private readonly api: apiGateway.IRestApi | undefined;
    protected readonly lambda_environment: { [key: string]: string } = {};

    protected readonly config;

    constructor(scope: Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        const layerConfigNames = props.layerConfigNames ? props.layerConfigNames : [];

        layerConfigNames.forEach((layerConfigName) => {
            const layerConfig = this.node.tryGetContext(props.environment)['layer-config'][layerConfigName];
            convertParamsToContext(layerConfig, this);
            this.layers[layerConfigName] = lambda.LayerVersion.fromLayerVersionArn(this, layerConfig.LAYER_ID, layerConfig.LAYER_VERSION_ARN);
        });

        // sets the config if defined
        // throws error if not ;)
        this.config = this.node.tryGetContext(props.environment)['services-config'][id];
        convertParamsToContext(this.config, this);

        // connects to api instance as defined by the api values in the config file
        if (props.api) {
            this.api = this.createApi();
        }

        // sets the lambda environment as defined by the lambda config file
        if (props.lambdaEnvironmentConfigNames) {
            this.setLambdaEnvironment(props.environment, props.lambdaEnvironmentConfigNames);
        }
    }

    private createApi() {
        const apiId = this.config.API.ID;
        const restApiId = this.config.API.REST_API;
        const rootResourceId = this.config.API.ROOT_RESOURCE;

        return apiGateway.RestApi.fromRestApiAttributes(this, apiId, {
            restApiId: restApiId,
            rootResourceId: rootResourceId,
        });
    }

    private setLambdaEnvironment(environment: string, lambdaEnvironmentConfigNames: string[]) {
        lambdaEnvironmentConfigNames.forEach((lambdaEnvironmentConfigName) => {
            const context = this.node.tryGetContext(environment)['lambda-config'][lambdaEnvironmentConfigName];
            convertParamsToContext(context, this, this.lambda_environment);
        });
    }

    protected getLayers(layerName?: string | string[]): lambda.ILayerVersion[] {
        if (!layerName) {
            return Object.values(this.layers);
        } else if (typeof layerName == 'string') {
            return [this.layers[layerName]];
        } else {
            return layerName.map((parameterName) => this.layers[parameterName]);
        }
    }

    protected addHttpMethod(path: string, method: string | string[], lambdaConstruct: lambda.Function): boolean {
        if (!this.api) {
            return false;
        }

        // find the correct resource for path
        let resource: apiGateway.IResource = this.api.root;
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
