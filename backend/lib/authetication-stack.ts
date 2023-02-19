import {Construct} from "constructs";
import * as cdk from "aws-cdk-lib";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dotenv from 'dotenv';
import { SecretValue } from "aws-cdk-lib";
dotenv.config()

export class AuthenticationStack extends cdk.Stack {

    GOOGLE_CLOUD_ID = process.env.GOOGLE_CLOUD_ID
    GOOGLE_CLOUD_SECRET = new SecretValue(process.env.GOOGLE_CLOUD_SECRET)

    readonly hostname: string;
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        const userpool = new cognito.UserPool(this, 'jungles2', {
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
            const provider = new cognito.UserPoolIdentityProviderGoogle(this, 'JGoogle', {
                clientId: this.GOOGLE_CLOUD_ID,
                clientSecretValue: this.GOOGLE_CLOUD_SECRET,
                userPool: userpool,
            });

            // provider.node.addDependency(userpool)

            const client = userpool.addClient("JungleCartWebsite", {
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
              })
            }
    }
}