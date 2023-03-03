import {query, createConnection}  from "/opt/nodejs/node_modules/sql-layer";

// create connection
createConnection('sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com','admin', 'password', '3306');

// handles routing and sends request
exports.handler = async function (event) {
    return authorizeLogin(event);
};

// handlers
export async function authorizeLogin(event): Promise<any> {

    let userEmail;
    try {
        userEmail = event.request.userAttributes.email;
    } catch (e) {
        throw new Error("Missing Email");
    }

    const sql = "SELECT email FROM dev.user WHERE email = ?";

    return query(sql, [userEmail])
        .then((results) => {
            const rows = results as any[];
            if (rows.length > 0) {
                return event;
            } else {
                console.log(`${userEmail} not in db`);
                throw new Error("NOT USER");
            }
        })
        .catch((error) => {
            // console.log(error);
            throw new Error("Something went wrong on our part. try again later");
        });

}
