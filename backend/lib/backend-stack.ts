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
        const dbEnvironment = {
            'RDS_NAME': 'sqlDB',
            'RDS_USERNAME': 'admin',
            'RDS_PASSWORD': 'password',
            'RDS_PORT': '3306',
        };

        const dbConstruct = new DatabaseConstruct(this, 'DatabaseConstruct', {
            name: dbEnvironment['RDS_HOSTNAME'],
            username: dbEnvironment['RDS_USERNAME'],
            password: dbEnvironment['RDS_PASSWORD'],
            port: dbEnvironment['RDS_PORT'],
            version: rds.MysqlEngineVersion.VER_8_0_23,
        });

        dbEnvironment['RDS_HOSTNAME'] = dbConstruct.hostname;

        // sql layer setup
        const sql_layer = new lambda.LayerVersion(this, 'SqlLayer', {
            code: lambda.Code.fromAsset('./dist/layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        });

        // api setup
        const apiConstruct = new ApiConstruct(this, 'ApiConstruct', {});

        // services
        const productService = new ProductsStack(this, 'ProductsStack', {
            layers: [sql_layer],
            api: apiConstruct,
            environment: dbEnvironment,
        });

        const authenticationStack = new ProductsStack(this, 'ProductsStack', {
            layers: [sql_layer],
            api: apiConstruct,
            environment: dbEnvironment,
        });
    }
}
