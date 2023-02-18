import * as rds from "aws-cdk-lib/aws-rds";

export interface DatabaseConstructProps {
    readonly name: string;
    readonly username: string;
    readonly password: string;
    readonly version: rds.MysqlEngineVersion;
    readonly port: number;
}