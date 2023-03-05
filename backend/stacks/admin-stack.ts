import { Construct } from 'constructs';
import { ServiceLambda } from '../lib/service-lambda';
import { ServiceStack, ServiceStackProps } from '../lib/service-stack';

export type AdminStackProps = ServiceStackProps;

export class AdminStack extends ServiceStack {
  constructor(scope: Construct, id: string, props: AdminStackProps) {
    super(scope, id, props);
    const admin_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
      dir: 'admin-lambda',
      layers: this.getLayers(['SQL_LAYER', 'ADMIN_LAYER']),
      environment: this.lambda_environment,
    });

    // /admins/:adminId
    this.addHttpMethod('admins/{adminId}', ['GET'], admin_lambda);

    // /admins/:adminId/users
    this.addHttpMethod('admins/{adminId}/users', ['POST', 'GET'], admin_lambda);

    // /admins/:adminId/users/:userId
    this.addHttpMethod(
      'admins/{adminId}/users/{userId}',
      ['DELETE'],
      admin_lambda
    );

    // /admins/:adminId/dashboard
    this.addHttpMethod('admins/{adminId}/dashboard', ['GET'], admin_lambda);
  }
}
