import mysql = require('mysql');

let connection: null | mysql.Connection;

export async function query(query: string, hostname: string, username: string, password: string, port: number) {
    console.log('sql-layer: query');

    if (!connection) {
        console.log('sql-layer: connection made')
        connection = mysql.createConnection({
            host: hostname,
            user: username,
            password: password,
            port: port,
            connectionLimit: 10,
            multipleStatements: true,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
            debug: true,
        });
    }

    return await new Promise((res, rej) => {
        connection.connect((err) => {
            if (err) {
                rej(err);
            }

            connection.query(query, (err, result) => {
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
