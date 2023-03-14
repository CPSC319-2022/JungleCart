import {Construct} from 'constructs';

import {ServiceLambda} from "../lib/service-lambda";
import {ServiceStack, ServiceStackProps} from "../lib/service-stack";

export interface TestStackProps extends ServiceStackProps {
    Name: string;
}

export class TestStack extends ServiceStack {
    constructor(scope: Construct, id: string, props: TestStackProps) {
        super(scope, id, props);

        const handler = new ServiceLambda(this, props.Name + "Lambda", {
            dir: 'products-lambda',
            layers: this.getLayers(),
            environment: this.lambda_environment,
        });

        this.addHttpMethod(
            props.Name + 'products',
            ['GET', 'POST'],
            handler
        );

        this.addHttpMethod(
            props.Name + 'products/:productId',
            ['DELETE', 'GET', 'POST'],
            handler
        );
    }
}
