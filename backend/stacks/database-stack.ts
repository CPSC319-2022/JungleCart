import {Construct} from "constructs";

import * as rds from "aws-cdk-lib/aws-rds";

import {DatabaseConstruct} from "../lib/database-construct";
import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export class DatabaseStack extends EnvironmentStack {

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
        super(scope, id, props);

        const dbConstructProps = this.node.tryGetContext(props.environment)['database-config'];

        new DatabaseConstruct(this, 'DatabaseConstruct', {
            name: dbConstructProps['RDS_NAME'],
            username: dbConstructProps['RDS_USERNAME'],
            password: dbConstructProps['RDS_PASSWORD'],
            port: dbConstructProps['RDS_PORT'],
            version: rds.MysqlEngineVersion.VER_8_0_23,
        });
    }
}
