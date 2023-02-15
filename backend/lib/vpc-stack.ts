import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import {Construct} from "constructs";

export class VpcStack extends cdk.Stack {

    readonly vpc: ec2.Vpc;

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        const vpc_name = 'database-vpc';

        this.vpc = new ec2.Vpc(this, 'vpc', {
            vpcName: vpc_name,
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
            maxAzs: 2,
            natGateways: 0,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'database-layer',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: 'application-layer',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
            ],
        });
    }
}