// noinspection SqlNoDataSourceInspection
// Object.defineProperty(exports, "__esModule", { value: true });

const sql_layer_1 = require("/opt/sql-layer");
//sql_layer_1.SQLConnectionManager.createConnection(true);
const error_layer_1 = require("/opt/customError-layer");

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const ses = new AWS.SES();
exports.handler = async function (event) {
    const sourceEmail = 'junglecart.gorillas@gmail.com';
    // const user = event.body.user;
    const order = event.body.order;
    // const showTable = `SHOW TABLES`;
    // const tables = await sql_layer_1.SQLConnectionManager.queryPool(showTable);
    // console.log(tables);
    const orderId = order.id;
    const sqlGetBuyerId = `SELECT buyer_id FROM sqlDB.orders o WHERE o.id = ${orderId}`;
    const buyerId = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetBuyerId)))[0]).buyer_id;
    const sqlGetBuyerName = `SELECT first_name FROM sqlDB.user u WHERE u.id = ${buyerId}`;
    const buyerName = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetBuyerName))))[0].first_name;
    const sqlGetBuyerEmail = `SELECT email FROM sqlDB.user u WHERE u.id = ${buyerId}`;
    const destinationEmail = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetBuyerEmail))))[0].email;
    const sqlGetOrderItems = `SELECT * from sqlDB.order_item oi WHERE oi.order_id = ${orderId}`;
    const orderItems = await (sql_layer_1.SQLConnectionManager.queryPool(sqlGetOrderItems));
    
    let emailBody = `<h1> Hello! ${buyerName} </h1> <br> <h3>Good news! Your recent order: #${orderId} has been <b>shipped! </b> </h3> <h2> Order details: </h2><br>`;
    const emailEnd = `<br> Best Regards, <br> Jungle Cart Team <br> <b><a href="https://main.d80mxyatc2g3o.amplifyapp.com/products?page=1"> Click here to go to home page </a></b>`;

    const shipped = 3;

    
    
    let tempShippingStatusId = 0;
    let tempProductId = 0;
    let tempQueryResult = null;
    
    const sqlUpdateOrderStatus = `UPDATE sqlDB.orders SET order_status_id = ${shipped} WHERE id = ${orderId}`;
    await sql_layer_1.SQLConnectionManager.queryPool(sqlUpdateOrderStatus);
    
    let sqlUpdateShippingStatus = `UPDATE sqlDB.shipping_status SET status = 'shipped' WHERE id = ${tempShippingStatusId}`;
    let sqlGetProductName = `SELECT name FROM sqlDB.product WHERE id=${tempProductId}`;
    for (let i = 0; i < orderItems.length; i++) {
        //adds product name to the email body and modify shipping status
        tempShippingStatusId = orderItems[i].shipping_status_id;
        sqlUpdateShippingStatus = `UPDATE sqlDB.shipping_status SET status = 'shipped' WHERE id = ${tempShippingStatusId}`;
        
        await sql_layer_1.SQLConnectionManager.queryPool(sqlUpdateShippingStatus);
        tempProductId = orderItems[i].product_id;
        sqlGetProductName = `SELECT name FROM sqlDB.product WHERE id=${tempProductId}`;
        tempQueryResult = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetProductName))))[0].name;
        emailBody += `<h3> ${tempQueryResult} * ${orderItems[i].quantity} </h3> <br>`;
    }
    emailBody += emailEnd;
    const params = {
        Destination: {
            ToAddresses: [
                destinationEmail,
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "Hello!"
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: "Thank you! Your order has been shipped."
            }
        },
        Source: 'junglecart.gorillas@gmail.com',
        ReplyToAddresses: [
            'junglecart.gorillas@gmail.com',
        ],
    };
    const res = await ses.sendEmail(params).promise().then(result => {
        console.log("successfully sent the email");
        console.log(result);
    });
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Shipping completed successfully' }),
    };
};
