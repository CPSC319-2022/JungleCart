import {Construct} from "constructs";

import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";

import {EnvironmentStackProps, EnvironmentStack} from "../lib/environment-stack";

export class DatabaseStack extends EnvironmentStack {
    readonly hostname;

    constructor(scope: Construct, id: string, props: EnvironmentStackProps) {
        super(scope, id, props);

        const config = this.node.tryGetContext(props.environment)['database-config'];

        const vpc = this.createVpc(config.VPC_ID);
        const security_group = this.createSecurityGroup(config.SECURITY_GROUP_ID, vpc);

        const rds_instance = new rds.DatabaseInstance(this, config.DB_INSTANCE_ID, {
            databaseName: config.NAME,
            credentials: rds.Credentials.fromUsername(config.USERNAME, {
                password: cdk.SecretValue.unsafePlainText(config.PASSWORD)
            }),
            instanceIdentifier: config.NAME,
            engine: rds.DatabaseInstanceEngine.mysql(
                {version: rds.MysqlEngineVersion.VER_8_0_23}
            ),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            allocatedStorage: 20,
            storageType: rds.StorageType.GP2,
            securityGroups: [security_group],
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            port: Number(config.PORT),
            vpc: vpc,
            backupRetention: cdk.Duration.days(7),
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            multiAz: false,
            deletionProtection: false,
            publiclyAccessible: true,
            autoMinorVersionUpgrade: true,
            storageEncrypted: true,
        });

        this.hostname = rds_instance.dbInstanceEndpointAddress;
    }

    private createVpc(id: string): ec2.Vpc {
        return new ec2.Vpc(this, id, {
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
            maxAzs: 2,
            natGateways: 0,
            subnetConfiguration: [
                {
                    name: 'database-layer',
                    subnetType: ec2.SubnetType.PUBLIC,
                }
            ],
        });
    }

    private createSecurityGroup(id: string, vpc: ec2.Vpc): ec2.SecurityGroup {
        const security_group = new ec2.SecurityGroup(this, id, {
            vpc: vpc,
            allowAllOutbound: true,
        });

        const all_traffic = ec2.Port.allTraffic();
        security_group.addIngressRule(security_group, all_traffic, 'all from self');
        security_group.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), all_traffic, 'all in');
        security_group.addEgressRule(ec2.Peer.ipv4('0.0.0.0/0'), all_traffic, 'all out');

        return security_group;
    }
}
