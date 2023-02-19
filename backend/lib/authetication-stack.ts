import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dotenv from 'dotenv';

dotenv.config({path: './resources/google-cloud.env'})

export class AuthenticationStack extends cdk.NestedStack {

    GOOGLE_CLOUD_ID = process.env.GOOGLE_CLOUD_ID
    GOOGLE_CLOUD_SECRET = new cdk.SecretValue(process.env.GOOGLE_CLOUD_SECRET)

    readonly hostname: string;

    constructor(scope: Construct, id: string, props: cdk.NestedStackProps) {
        super(scope, id, props);

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
            const provider = new cognito.UserPoolIdentityProviderGoogle(this, 'GoogleProvider', {
                clientId: this.GOOGLE_CLOUD_ID,
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
}