import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";

export interface EnvironmentStackProps extends cdk.StackProps {
    readonly environment: string;
}

export class EnvironmentStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
        super(scope,
            id,
            props.env ?
                props :
                {...props, env: scope.node.tryGetContext(props.environment)['env-config']}
        );
    }
}
