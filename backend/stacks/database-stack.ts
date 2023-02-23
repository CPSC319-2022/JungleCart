import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";

import {DatabaseConstruct} from "../lib/database-construct";

export interface DatabaseStackProps extends cdk.StackProps {
    readonly dbConstructProps: {[key: string]: string};
}

export class DatabaseStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: DatabaseStackProps) {
        super(scope, id, props);

        new DatabaseConstruct(this, 'DatabaseConstruct', {
            name: props.dbConstructProps['RDS_NAME'],
            username: props.dbConstructProps['RDS_USERNAME'],
            password: props.dbConstructProps['RDS_PASSWORD'],
            port: props.dbConstructProps['RDS_PORT'],
            version: rds.MysqlEngineVersion.VER_8_0_23,
        });
    }
}
