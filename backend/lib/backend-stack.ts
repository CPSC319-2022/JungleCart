import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as lambda from "aws-cdk-lib/aws-lambda";

import {DatabaseConstruct} from "../constructs/database-construct";
import {ProductsStack} from "./products-stack";
import {ApiConstruct} from "../constructs/api-construct";

export class BackendStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        // db setup
        const db_environment = {
            'RDS_NAME': 'sqlDB',
            'RDS_USERNAME': 'admin',
            'RDS_PASSWORD': 'password',
            'RDS_PORT': '3306',
        };

        const db_construct = new DatabaseConstruct(this, 'DatabaseConstruct', {
            name: db_environment['RDS_HOSTNAME'],
            username: db_environment['RDS_USERNAME'],
            password: db_environment['RDS_PASSWORD'],
            port: db_environment['RDS_PORT'],
            version: rds.MysqlEngineVersion.VER_8_0_23,
        });

        db_environment['RDS_HOSTNAME'] = db_construct.hostname;

        // sql layer setup
        const sql_layer = new lambda.LayerVersion(this, 'SqlLayer', {
            code: lambda.Code.fromAsset('./dist/layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        // api setup
        const api_construct = new ApiConstruct(this, 'ApiConstruct', {});

        // services
        const product_service = new ProductsStack(this, 'ProductsStack', {
            layers: [sql_layer],
            api: api_construct,
            environment: db_environment,
        });
    }
}
