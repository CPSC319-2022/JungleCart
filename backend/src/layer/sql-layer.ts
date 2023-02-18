import mysql = require('mysql');

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

export async function createDatabase() {
    console.log('sql-layer: createDatabase');

    return await new Promise((res, rej) => {
        connection.connect((err) => {
            if (err) {
                rej(err);
            }

            connection.query('CREATE DATABASE testdb', (err, result) => {
                if (err) {
                    rej(err);
                }

                res({
                    statusCode: 200,
                    body: JSON.stringify(result),
                });
            })
        });
    }).catch((err) => {
        console.log('sql-layer: error - ' + err.message);
        return {
            statusCode: 400,
            body: err.message,
        };
    });
}
