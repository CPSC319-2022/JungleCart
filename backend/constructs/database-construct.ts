import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";

import {Asset} from "aws-cdk-lib/aws-s3-assets";

export interface DatabaseConstructProps {
    readonly name: string;
    readonly username: string;
    readonly password: string;
    readonly version: rds.MysqlEngineVersion;
    readonly port: string;
}

export class DatabaseConstruct extends Construct {

    readonly hostname: string;

    constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
        super(scope, id);

        const [vpc, security_group] = this.setupVPC(id);

        const credentials = rds.Credentials.fromUsername(props.username, {
            password: cdk.SecretValue.unsafePlainText(props.password)
        });

        const db_instance = new rds.DatabaseInstance(this, 'Database', {
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
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            port: Number(props.port),
            vpc: vpc,
            backupRetention: cdk.Duration.days(7),
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            multiAz: false,
            deletionProtection: false,
            publiclyAccessible: true,
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

    private setupVPC(id: string): [ec2.Vpc, ec2.SecurityGroup] {
        const vpc = new ec2.Vpc(this, 'Vpc', {
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

        const security_group = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
            vpc: vpc,
            allowAllOutbound: true,
            description: id + ' database',
        });

        const all_traffic = ec2.Port.allTraffic();
        security_group.addIngressRule(security_group, all_traffic, 'all from self');
        security_group.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), all_traffic, 'all in');
        security_group.addEgressRule(ec2.Peer.ipv4('0.0.0.0/0'), all_traffic, 'all out');

        return [vpc, security_group];
    }

    public init(sql_layer) {
        const db_init_asset = new Asset(this, 'DbInitSql', {
            path: './resources/init-db.sql'
        });

        const db_init_lambda = new lambda.Function(this, 'DbInitLambdaFunction', {
            code: lambda.Code.fromAsset('src/lambda'),
            handler: 'rds-initializer-lambda.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            environment: {
                'S3_BUCKET_NAME': db_init_asset.s3BucketName,
                'S3_OBJECT_KEY': db_init_asset.s3ObjectKey,
                'S3_URL': db_init_asset.httpUrl,
            },
            layers: [sql_layer],
        });

        db_init_asset.grantRead(db_init_lambda);

        new tasks.LambdaInvoke(this, 'InvokeDbInit', {
            lambdaFunction: db_init_lambda,
        });
    }

    public CfnOutputList(list_to_output: [string, string][]) {
        for (const [name, value] of list_to_output) {
            new cdk.CfnOutput(this, name, {
                exportName: name,
                value: value,
            });
        }
    }
}