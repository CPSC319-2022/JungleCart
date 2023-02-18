import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

import {ApiConstruct} from "../constructs/api-construct";

export interface ProductsStackProps extends cdk.StackProps {
    readonly api: ApiConstruct;
    readonly layers: lambda.ILayerVersion[];
}