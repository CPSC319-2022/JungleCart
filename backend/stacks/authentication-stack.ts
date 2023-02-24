import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as cognito from 'aws-cdk-lib/aws-cognito';

import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export class AuthenticationStack extends EnvironmentStack {

    readonly GOOGLE_CLOUD_ID: string | undefined;
    readonly GOOGLE_CLOUD_SECRET: cdk.SecretValue | undefined;

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
        super(scope, id, props);

        const auth = this.node.tryGetContext(props.environment)['auth-config'];
        this.GOOGLE_CLOUD_ID = auth['GOOGLE_CLOUD_ID'];
        this.GOOGLE_CLOUD_SECRET = cdk.SecretValue.unsafePlainText(auth['GOOGLE_CLOUD_SECRET']);

        const userPool = new cognito.UserPool(this, 'UserPool', {
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
        const provider = new cognito.UserPoolIdentityProviderGoogle(this, 'GoogleProvider', {
            clientId: this.GOOGLE_CLOUD_ID as string,
            clientSecretValue: this.GOOGLE_CLOUD_SECRET,
            userPool: userPool
        });

        const client = userPool.addClient("Website", {
            supportedIdentityProviders: [
                cognito.UserPoolClientIdentityProvider.GOOGLE,
            ],
            oAuth: {
                flows: {
                    implicitCodeGrant: true,
                },
                callbackUrls: [
                    'https://main.d80mxyatc2g3o.amplifyapp.com/oauth2/idpresponse',
                ],
            },
        });

        client.node.addDependency(provider);
    }
}
