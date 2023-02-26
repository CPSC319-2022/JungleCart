import {Construct} from "constructs";

import * as path from "path";
import * as fs from "fs";

import * as cdk from "aws-cdk-lib/core/lib/app";
import * as ssm from "aws-cdk-lib/aws-ssm";

type JsonData = string | number | boolean | Json | Array<JsonData> | null;
type Json = { [key: string]: JsonData };
const isJson = (jsonData: JsonData): jsonData is Json =>
    (typeof jsonData == "object" && !(jsonData instanceof Array) && jsonData !== null);

let CONTEXT: Json;

export function getParsedContext(app: cdk.App, environment: string): JsonData {
    CONTEXT = app.node.tryGetContext(environment);
    convertFilePathsToContext(CONTEXT);
    convertConfigPathsToContext(CONTEXT);
    return CONTEXT;
}

function traverseContext(context: Json, conditional: (value: JsonData) => boolean, callback: (context: JsonData, key: string, value: JsonData) => void) {
    for (const [key, value] of Object.entries(context)) {
        if (conditional(value)) {
            callback(context, key, value);
        } else if (isJson(value)) {
            traverseContext(value, conditional, callback);
        } else if (value instanceof Array) {
            value.forEach((obj) => {
                if (isJson(obj)) traverseContext(obj, conditional, callback);
            });
        } else if (value === null) {
            delete context[key];
        }
    }
}

type FilePath = string;
const isFilePath = (jsonData: JsonData): jsonData is FilePath =>
    (typeof jsonData === "string" && path.extname(jsonData) === ".json");

function convertFilePathsToContext(context: Json): void {
    const isFilePathAndFileExists = (jsonData: JsonData): jsonData is FilePath =>
        (isFilePath(jsonData) && fs.existsSync(jsonData));
    const setContextToFileData = (context, key, value) => {
        context[key] = JSON.parse(fs.readFileSync(value, "utf8"));
    };

    traverseContext(context, isFilePathAndFileExists, setContextToFileData);
}

type ConfigPath = { "@CONFIG_PATH": string };
const isConfigPath = (jsonData: JsonData): jsonData is ConfigPath =>
    (isJson(jsonData) && '@CONFIG_PATH' in jsonData);

function convertConfigPathsToContext(context: Json): void {
    const setContextToConfigPathData = (context, key, value) => {
        context[key] = value['@CONFIG_PATH'].split('.').reduce((acc, cur) => acc[cur], CONTEXT);
    };

    traverseContext(context, isConfigPath, setContextToConfigPathData);
}

type Param = { "@PARAM": { "ID": string, "NAME": string } };
const isParam = (jsonData: JsonData): jsonData is Param =>
    (isJson(jsonData) && '@PARAM' in jsonData);

export function convertParamsToContext(context: Json, scope: Construct, map?) {
    const setContextToParamData = (context, key, value) => {
        (map ? map : context)[key] = ssm.StringParameter.valueForStringParameter(scope, value['@PARAM'].NAME);
    };

    traverseContext(context, isParam, setContextToParamData);
}
