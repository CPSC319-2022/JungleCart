import {Construct} from 'constructs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import * as ssm from "aws-cdk-lib/aws-ssm";

import {EnvironmentStack, EnvironmentStackProps} from "./environment-stack";
import {ILayerVersion} from "aws-cdk-lib/aws-lambda";

export interface ServiceStackProps extends EnvironmentStackProps {
    readonly layerConfigNames?: [parameterName: string];
    readonly api?: boolean;
    readonly lambdaEnvironmentConfigNames?: [key: string];
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
            const layer_config = this.node.tryGetContext(props.environment)['layer-config'][layerConfigName];

            const arn = ssm.StringParameter.fromStringParameterAttributes(this, 'imported' + layer_config.LAYER_NAME_PARAMETER_ID, {
                parameterName: layer_config.LAYER_NAME_PARAMETER_NAME
            }).stringValue;
            this.layers[layerConfigName] = lambda.LayerVersion.fromLayerVersionArn(this, id + layer_config.LAYER_NAME_PARAMETER_ID + "Layer", arn);
        });

        // connects to api instance as defined by the api config file
        if (props.api) {
            this.api = this.createApi(id, props.environment);
        }

        // sets the lambda environment as defined by the lambda config file
        if (props.lambdaEnvironmentConfigNames) {
            this.setLambdaEnvironment(props.environment, props.lambdaEnvironmentConfigNames);
        }

        // sets the config if defined
        if (typeof this.node.tryGetContext(props.environment)['services-config'][id] !== 'undefined') {
            this.config = this.node.tryGetContext(props.environment)['services-config'][id];
        }
    }

    private createApi(id: string, environment: string) {
        const apiConfig = this.node.tryGetContext(environment)['api-config'];

        const restApiId = ssm.StringParameter.fromStringParameterAttributes(this, 'imported' + apiConfig.REST_API_PARAMETER_ID, {
            parameterName: apiConfig.REST_API_PARAMETER_NAME,
        }).stringValue;

        const rootResourceId = ssm.StringParameter.fromStringParameterAttributes(this, 'imported' + apiConfig.ROOT_RESOURCE_ID_PARAMETER_ID, {
            parameterName: apiConfig.ROOT_RESOURCE_ID_PARAMETER_NAME,
        }).stringValue;

        return apiGateway.RestApi.fromRestApiAttributes(this, id + apiConfig.REST_API_ID, {
            restApiId: restApiId,
            rootResourceId: rootResourceId,
        });
    }

    private setLambdaEnvironment(environment: string, lambdaEnvironmentConfigNames: [key: string]) {
        lambdaEnvironmentConfigNames.forEach((lambdaEnvironmentConfigName) => {
            const lambdaEnvironment = this.node.tryGetContext(environment)['lambda-config'][lambdaEnvironmentConfigName];

            Object.keys(lambdaEnvironment).forEach((key) => {
                this.lambda_environment[key] = this.getContext(environment, lambdaEnvironment[key]);
            });
        });
    }

    private getContext(environment: string, context) {
        switch (this.getContextType(context)) {
            case "CONFIG":
                return this.getContext(environment, this.getContextForConfigType(environment, context));
            case "KMS":
                return this.getContext(environment, this.getContextForKmsType(environment, context));
            case "PRIMITIVE":
                return context;
        }
    }

    private getContextType(context) {
        if (typeof context.CONFIG !== 'undefined') {
            return 'CONFIG';
        } else if (typeof context.KMS !== 'undefined') {
            return 'KMS';
        } else {
            return 'PRIMITIVE';
        }
    }

    private getContextForConfigType(environment: string, context) {
        const path = context.CONFIG;
        return this.getContextFromPath(environment, path);
    }

    private getContextForKmsType(environment: string, context) {
        const kms = context.KMS;
        const id = typeof kms.ID.CONFIG !== 'undefined' ? this.getContextFromPath(environment, kms.ID.CONFIG) : kms.ID;
        const name = typeof kms.NAME.CONFIG !== 'undefined' ? this.getContextFromPath(environment, kms.NAME.CONFIG) : kms.NAME;

        return ssm.StringParameter.fromStringParameterAttributes(this, 'imported' + id, {
            parameterName: name,
        }).stringValue;
    }

    private getContextFromPath(environment: string, configPath: string): string {
        let config = this.node.tryGetContext(environment);
        configPath.split('.').forEach((pathPart) => config = config[pathPart]);
        return config;
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
