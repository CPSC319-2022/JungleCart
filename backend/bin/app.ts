#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {BackendStack} from "../stacks/backend-stack";

const app = new cdk.App();

const props: cdk.StackProps = {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
};

new BackendStack(app, 'BackendStack', props);
