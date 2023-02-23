import {Construct} from "constructs";

import * as cdk from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as lambda from "aws-cdk-lib/aws-lambda";

import {DatabaseConstruct} from "../lib/database-construct";
import {ApiConstruct} from "../lib/api-construct";
import {ProductsStack} from "./products-stack";
import {AuthenticationStack} from "./authetication-stack";

export class BackendStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        // db setup
        const dbEnvironment = {
            'RDS_NAME': 'sqlDB',
            'RDS_USERNAME': 'admin',
            'RDS_PASSWORD': 'password',
            'RDS_PORT': '3306',
        };

        new DatabaseConstruct(this, 'DatabaseConstruct', {
            name: dbEnvironment['RDS_NAME'],
            username: dbEnvironment['RDS_USERNAME'],
            password: dbEnvironment['RDS_PASSWORD'],
            port: dbEnvironment['RDS_PORT'],
            version: rds.MysqlEngineVersion.VER_8_0_23,
        });

        dbEnvironment['RDS_HOSTNAME'] = cdk.Fn.importValue('databaseEndpoint');

        // sql layer setup
        const sql_layer = new lambda.LayerVersion(this, 'SqlLayer', {
            code: lambda.Code.fromAsset('./dist/layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        // api setup
        const apiConstruct = new ApiConstruct(this, 'ApiConstruct', {});

        // services
        new AuthenticationStack(this, 'AuthenticationStack', {}).node.addDependency(this);

        new ProductsStack(this, 'ProductsStack', {
            layers: [sql_layer],
            api: apiConstruct,
            environment: dbEnvironment,
            env: props.env,
        }).node.addDependency(apiConstruct);
    }
}
