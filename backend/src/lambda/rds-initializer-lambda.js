const mysql = require("/opt/nodejs/sql-layer");
const path = require("path");
const fs = require("fs");

exports.handler = async function () {
    const sqlScript = fs.readFileSync(path.join(__dirname, 'script.sql')).toString()

    return mysql.query(
        sqlScript,
        process.env.RDS_HOSTNAME,
        process.env.RDS_USERNAME,
        process.env.RDS_PASSWORD,
        process.env.RDS_PORT
    );
}