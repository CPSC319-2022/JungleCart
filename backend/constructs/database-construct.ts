import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

import {DatabaseConstructProps} from "../props/database-construct-props";

export class DatabaseConstruct extends Construct {

    readonly hostname: string;

    constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
        super(scope, id);

        const [vpc, security_group] = this.setupVPC(id);

        const credentials = rds.Credentials.fromUsername(props.username, {
            password: cdk.SecretValue.unsafePlainText(props.password)
        });

        const parameter_group = new rds.ParameterGroup(this, 'parameterGroup', {
            engine: rds.DatabaseInstanceEngine.mysql({
                version: props.version,
            }),
            parameters: {open_cursors: '2500'},
        });

        const db_instance = new rds.DatabaseInstance(this, 'database', {
            databaseName: props.name,
            credentials: credentials,
            instanceIdentifier: props.name,
            engine: rds.DatabaseInstanceEngine.mysql(
                {version: props.version}
            ),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            allocatedStorage: 20,
            storageType: rds.StorageType.GP2,
            securityGroups: [security_group],
            port: props.port,
            vpc: vpc,
            parameterGroup: parameter_group,
            backupRetention: cdk.Duration.days(7),
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            multiAz: false,
            deletionProtection: false,
            publiclyAccessible: false,
            autoMinorVersionUpgrade: true,
            storageEncrypted: true,
        });

        this.hostname = db_instance.dbInstanceEndpointAddress;

        this.CfnOutputList([
            ['databaseEndpoint', db_instance.dbInstanceEndpointAddress],
            ['databaseUsername', props.username],
            ['databaseName', props.name],
        ]);
    }

    setupVPC(id: string): [ec2.Vpc, ec2.SecurityGroup] {
        const vpc = new ec2.Vpc(this, 'vpc', {
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

        vpc.publicSubnets.forEach(subnet => {
            cdk.Tags.of(subnet).add(
                'aws-cdk:subnet-type',
                'Public'
            );
        });

        const security_group = new ec2.SecurityGroup(this, 'databaseSecurityGroup', {
            vpc: vpc,
            allowAllOutbound: true,
            description: id + ' database',
            securityGroupName: id + ' database',
        });

        const all_traffic = ec2.Port.allTraffic();
        security_group.addIngressRule(security_group, all_traffic, 'all from self');
        security_group.addEgressRule(ec2.Peer.ipv4('0.0.0.0/0'), all_traffic, 'all out');

        return [vpc, security_group];
    }

    CfnOutputList(list_to_output: [string, string][]) {
        for (const [name, value] of list_to_output) {
            new cdk.CfnOutput(this, name, {
                exportName: name,
                value: value,
            });
        }
    }
}