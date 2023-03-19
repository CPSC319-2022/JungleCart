import {Construct} from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

import {EnvironmentStack} from './environment-stack';
export interface ServiceStackProps extends cdk.StackProps {
    readonly api?: boolean;
    readonly lambdaEnvironmentConfigNames?: string[];
}

export class ServiceStack extends EnvironmentStack {
    protected lambda_environment: { [key: string]: string } = {};
    protected readonly config;
    private layers: { [parameterName: string]: lambda.ILayerVersion } = {};
    private readonly api: boolean;

    constructor(scope: Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        // sets the config
        this.config = this.node.tryGetContext(
            this.node.tryGetContext('env')
        )['services-config'][id];

        this.api = props.api ? props.api : false;

        this.createLayer("COMMON","COMMON", "COMMON");
        this.createLayer("NODE_MODULES_LAYER","nodejs", "node_modules");

        if (this.config.LAYERS) {
            this.config.LAYERS.forEach(
                (layer: { NAME: string; DIR: string; ID: string }) => {
                    this.createLayer(layer.NAME, layer.DIR, layer.ID);
                }
            );
        }

        // sets the lambda environment as defined by the lambda config file
        if (props.lambdaEnvironmentConfigNames) {
            this.setLambdaEnvironment(
                props.lambdaEnvironmentConfigNames
            );
        }
    }

    protected createLayer(name: string, dir: string, id: string) {
        if (name in this.layers) return false;
        this.layers[name] = new lambda.LayerVersion(this, id, {
            code: lambda.Code.fromAsset(path.join('./dist/src/layer/', dir)),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });
        return true;
    }

    protected getLayers(layerName?: string | string[]): lambda.ILayerVersion[] {
        if (!layerName) {
            return Object.values(this.layers);
        } else if (typeof layerName == 'string') {
            return [this.layers[layerName]];
        } else {
            return  layerName.map((parameterName) => this.layers[parameterName]);
        }
    }

    private setLambdaEnvironment(lambdaEnvironmentConfigNames: string[]) {
        lambdaEnvironmentConfigNames.forEach((lambdaEnvironmentConfigName) => {
            this.lambda_environment = {
                ...this.lambda_environment,
                ...this.node.tryGetContext(
                    this.node.tryGetContext('env')
                )['lambda-config'][lambdaEnvironmentConfigName],
            };
        });
    }
}
