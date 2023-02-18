import {createDatabase} from "/opt/nodejs/node_modules/sql-layer";

exports.handler = async function (event, context) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    return createDatabase();
}