import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from 'aws-cdk-lib/aws-ec2';


export class DatabaseStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const db_subnet_group_name = 'my-db-subnet-group';
        const db_name = 'my-db-name';
        const db_username = 'admin';
        const db_password = 'password';

        const vpc = new ec2.Vpc(this, 'vpc', {
            maxAzs: 2
        });

        const db_subnet_group = new rds.SubnetGroup(this, 'DbSubnetGroup', {
            vpc: vpc,
            subnetGroupName: db_subnet_group_name,
            description: 'My database subnet group',
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
        });

        const db_instance = new rds.DatabaseInstance(this, 'database', {
            engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_23 }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
            vpc: vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            multiAz: false,
            allocatedStorage: 20,
            storageType: rds.StorageType.GP2,
            autoMinorVersionUpgrade: true,
            backupRetention: cdk.Duration.days(7),
            deletionProtection: true,
            databaseName: db_name,
            credentials: rds.Credentials.fromUsername(db_username, {
                password: cdk.SecretValue.plainText(db_password)
            }),
            subnetGroup: db_subnet_group,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        // Allow inbound traffic to the RDS instance
        db_instance.connections.allowDefaultPortFromAnyIpv4();
    }
}