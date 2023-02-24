import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as cognito from 'aws-cdk-lib/aws-cognito';

import {ServiceStack, ServiceStackProps} from "../lib/service-stack";

export class AuthenticationStack extends ServiceStack {

    readonly GOOGLE_CLOUD_ID: string;
    readonly GOOGLE_CLOUD_SECRET: cdk.SecretValue;

    constructor(scope: Construct, id: string, props: ServiceStackProps) {
        super(scope, id, props);

        this.GOOGLE_CLOUD_ID = this.config.GOOGLE_CLOUD_ID;
        this.GOOGLE_CLOUD_SECRET = cdk.SecretValue.unsafePlainText(this.config.GOOGLE_CLOUD_SECRET);

        const userPool = new cognito.UserPool(this, this.config.USER_POOL_ID, {
            selfSignUpEnabled: false,
            standardAttributes: {
                address: {
                    required: false,
                    mutable: true,
                },
                phoneNumber: {
                    required: false,
                    mutable: true,
                },
                familyName: {
                    required: false,
                    mutable: true,
                },
                givenName: {
                    required: false,
                    mutable: true,
                },
            },
        });

        if (this.GOOGLE_CLOUD_ID && this.GOOGLE_CLOUD_SECRET) {
            this.addGoogleAuth(userPool);
        }
    }

    private addGoogleAuth(userPool: cognito.UserPool) {
        const provider = new cognito.UserPoolIdentityProviderGoogle(this, this.config.GOOGLE_PROVIDER_ID, {
            clientId: this.GOOGLE_CLOUD_ID,
            clientSecretValue: this.GOOGLE_CLOUD_SECRET,
            userPool: userPool
        });

        const client = userPool.addClient(this.config.CLIENT_ID, {
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.GOOGLE,
            ],
            oAuth: {
                flows: {
                    implicitCodeGrant: true,
                },
                callbackUrls: [
                    this.config.CLIENT_O_AUTH_CALLBACK_URLS,
                ],
            },
        });

        client.node.addDependency(provider);
    }
}
