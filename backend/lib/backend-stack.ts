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

        const db_name = 'sqlDB';
        const db_username = 'admin';
        const db_password = 'password';
        const db_version = rds.MysqlEngineVersion.VER_8_0_23;
        const db_port = 3306;

        const db_construct = new DatabaseConstruct(this, 'databaseConstruct', {
            name: db_name,
            username: db_username,
            password: db_password,
            version: db_version,
            port: db_port,
        });

        const sql_layer = new lambda.LayerVersion(this, 'sqlLayer', {
            code: lambda.Code.fromAsset('./dist/layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        const api_construct = new ApiConstruct(this, 'apiConstruct', {});

        const product_service = new ProductsStack(this, 'productsStack', {
            layers: [sql_layer],
            api: api_construct,
        });


    }
}