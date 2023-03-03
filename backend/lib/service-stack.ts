import {Construct} from 'constructs';

import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

import {EnvironmentStack, EnvironmentStackProps} from "./environment-stack";
import * as api_gw from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export interface ServiceStackProps extends EnvironmentStackProps {
    readonly api?: boolean;
    readonly lambdaEnvironmentConfigNames?: string[];
}

export class ServiceStack extends EnvironmentStack {
    private layers: { [parameterName: string]: lambda.ILayerVersion } = {};
    private readonly api: apiGateway.IRestApi | undefined;
    protected lambda_environment: { [key: string]: string } = {};

    protected readonly config;

    constructor(scope: Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        // sets the config
        this.config = this.node.tryGetContext(props.environment)['services-config'][id];

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
        return new api_gw.RestApi(this, this.config.REST_API_ID, {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: ['POST', 'GET', 'DELETE', 'PUT'],
                allowCredentials: true,
            }
        });
    }

    protected createLayer(name: string) {
        this.layers[name] = new lambda.LayerVersion(this, this.config.LAYER[name].ID, {
            code: lambda.Code.fromAsset(path.join('./dist/src/layer/', this.config.LAYER[name].DIR)),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });
    }

    private setLambdaEnvironment(environment: string, lambdaEnvironmentConfigNames: string[]) {
        lambdaEnvironmentConfigNames.forEach((lambdaEnvironmentConfigName) => {
            this.lambda_environment = {...this.lambda_environment, ...this.node.tryGetContext(environment)['lambda-config'][lambdaEnvironmentConfigName]};
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
