import {query} from "/opt/nodejs/sql-layer";

exports.handler = async function (event, context) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    console.log("request:", JSON.stringify(context, undefined, 2));
}

const random = function () {
    return query(
        'CREATE TABLE',
        process.env.RDS_HOSTNAME,
        process.env.RDS_USERNAME,
        process.env.RDS_PASSWORD,
        process.env.RDS_PORT
    );
}