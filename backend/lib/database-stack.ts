import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import {DatabaseStackProps} from "./stack-props";

export class DatabaseStack extends cdk.Stack {

    readonly hostname: string;
    constructor(scope: Construct, id: string, props: DatabaseStackProps) {
        super(scope, id, props);

        const db_name = 'dbName';
        const db_username = 'admin';
        const db_password = 'password';

        const db_instance = new rds.DatabaseInstance(this, 'database', {
            engine: rds.DatabaseInstanceEngine.mysql({version: rds.MysqlEngineVersion.VER_8_0_23}),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            port: 3306,
            vpc: props.vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            multiAz: false,
            allocatedStorage: 20,
            storageType: rds.StorageType.GP2,
            autoMinorVersionUpgrade: true,
            backupRetention: cdk.Duration.days(7),
            deletionProtection: false,
            databaseName: db_name,
            credentials: rds.Credentials.fromUsername(db_username, {
                password: cdk.SecretValue.unsafePlainText(db_password)
            }),
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        // Allow inbound traffic to the RDS instance
        // db_instance.connections.allowDefaultPortFromAnyIpv4();

        db_instance.connections.allowFrom(
            ec2.Peer.ipv4('10.0.0.0/16'),
            ec2.Port.tcp(3306),
            'Allow access to private RDS from public subnet'
        );

        this.hostname = db_instance.dbInstanceEndpointAddress;

        new cdk.CfnOutput(this, 'RDSEndpoint', {
            value: db_instance.dbInstanceEndpointAddress,
        });
    }
}