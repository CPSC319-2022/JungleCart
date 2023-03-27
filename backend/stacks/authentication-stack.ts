import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { EnvironmentStack } from "../lib/environment-stack";

export class AuthenticationStack extends EnvironmentStack {
  readonly GOOGLE_CLOUD_ID: string;
  readonly GOOGLE_CLOUD_SECRET: cdk.SecretValue;
  private readonly config;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.config = props;

    this.GOOGLE_CLOUD_ID = this.config.GOOGLE_CLOUD_ID;
    this.GOOGLE_CLOUD_SECRET = cdk.SecretValue.unsafePlainText(
      this.config.GOOGLE_CLOUD_SECRET
    );
    // FIXME: disabled post-auth for now as it's not needed. to be removed or fixed once finalized
    // const auth_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
    //   dir: 'auth-lambda',
    //   layers: this.getLayers([]),
    //   environment: this.lambda_environment,
    // });

    const userPool = new cognito.UserPool(this, this.config.USER_POOL_ID, {
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      autoVerify: { email: true},
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    if (this.GOOGLE_CLOUD_ID && this.GOOGLE_CLOUD_SECRET) {
      this.addGoogleAuth(userPool);
    }
  }

  private addGoogleAuth(userPool: cognito.UserPool) {
    const provider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      this.config.GOOGLE_PROVIDER_ID,
      {
        clientId: this.GOOGLE_CLOUD_ID,
        clientSecretValue: this.GOOGLE_CLOUD_SECRET,
        scopes: ['email', 'profile'],
        userPool: userPool,
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
        },
      }
    );

    const client = userPool.addClient(this.config.CLIENT_ID, {
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        callbackUrls: this.config.CLIENT_O_AUTH_CALLBACK_URLS,
      },
    });
    client.node.addDependency(provider);
  }
}
