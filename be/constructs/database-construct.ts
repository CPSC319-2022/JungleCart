import { Construct } from 'constructs'

import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as rds from 'aws-cdk-lib/aws-rds'

export interface DatabaseConstructProps {
  readonly name: string
  readonly username: string
  readonly password: string
  readonly version: rds.MysqlEngineVersion
  readonly port: string
}

export class DatabaseConstruct extends Construct {
  readonly hostname: string

  constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
    super(scope, id)

    const vpc = this.setupVPC()
    const security_group = this.setupSecurityGroup(vpc)

    const db_instance = new rds.DatabaseInstance(this, 'Database', {
      databaseName: props.name,
      credentials: rds.Credentials.fromUsername(props.username, {
        password: cdk.SecretValue.unsafePlainText(props.password),
      }),
      instanceIdentifier: props.name,
      engine: rds.DatabaseInstanceEngine.mysql({ version: props.version }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
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
    })

    this.hostname = db_instance.dbInstanceEndpointAddress

    new cdk.CfnOutput(this, 'databaseEndpoint', {
      exportName: 'databaseEndpoint',
      value: db_instance.dbInstanceEndpointAddress,
    })
  }

  private setupVPC(): ec2.Vpc {
    return new ec2.Vpc(this, 'Vpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'database-layer',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    })
  }

  private setupSecurityGroup(vpc: ec2.Vpc): ec2.SecurityGroup {
    const security_group = new ec2.SecurityGroup(
      this,
      'DatabaseSecurityGroup',
      {
        vpc: vpc,
        allowAllOutbound: true,
      }
    )

    const all_traffic = ec2.Port.allTraffic()
    security_group.addIngressRule(security_group, all_traffic, 'all from self')
    security_group.addIngressRule(
      ec2.Peer.ipv4('0.0.0.0/0'),
      all_traffic,
      'all in'
    )
    security_group.addEgressRule(
      ec2.Peer.ipv4('0.0.0.0/0'),
      all_traffic,
      'all out'
    )

    return security_group
  }
}
