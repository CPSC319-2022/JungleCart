const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.RDS_LAMBDA_HOSTNAME,
    user: process.env.RDS_LAMBDA_USERNAME,
    password: process.env.RDS_LAMBDA_PASSWORD,
    port: process.env.RDS_LAMBDA_PORT,
    connectionLimit: 10,
    multipleStatements: true,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    debug: true,
});

exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event, undefined, 2));

    try {
        const data = await new Promise((resolve, reject) => {
            connection.connect((err) => {
                if (err) {
                    reject(err);
                }

                connection.query('CREATE DATABASE testdb', (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }

                    resolve(result);
                });
            });
        });

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        }
    } catch (err) {
        return {
            statusCode: 400,
            body: err.message,
        }
    }
}