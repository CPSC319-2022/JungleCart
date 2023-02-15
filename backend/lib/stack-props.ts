import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface StackVPCProps extends cdk.StackProps {
    vpc: ec2.Vpc,
}

export type DatabaseStackProps = StackVPCProps;

export interface ProductsStackProps extends StackVPCProps {
    hostname: string,
    port: string,
    username: string,
    password: string,
}