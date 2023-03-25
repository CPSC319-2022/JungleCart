import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';

import { ServiceStack, ServiceStackProps } from '../lib/service-stack';
import { ServiceLambda } from '../lib/service-lambda';

export class AuthenticationStack extends ServiceStack {
  readonly GOOGLE_CLOUD_ID: string;
  readonly GOOGLE_CLOUD_SECRET: cdk.SecretValue;

  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props);

    this.GOOGLE_CLOUD_ID = this.config.GOOGLE_CLOUD_ID;
    this.GOOGLE_CLOUD_SECRET = cdk.SecretValue.unsafePlainText(
      this.config.GOOGLE_CLOUD_SECRET
    );

    const auth_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
      dir: 'auth-lambda',
      layers: this.getLayers([]),
    });

    const userPool = new cognito.UserPool(this, this.config.USER_POOL_ID, {
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      lambdaTriggers: {
        postAuthentication: auth_lambda,
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
        callbackUrls: [this.config.CLIENT_O_AUTH_CALLBACK_URLS],
      },
    });
    client.node.addDependency(provider);
  }
}
