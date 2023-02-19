const mysql = require("/opt/nodejs/sql-layer");

exports.handler = async function (event, context) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    return mysql.query(
        'CREATE TABLE',
        process.env.RDS_HOSTNAME,
        process.env.RDS_USERNAME,
        process.env.RDS_PASSWORD,
        process.env.RDS_PORT
    );
}