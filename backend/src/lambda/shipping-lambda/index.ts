// noinspection SqlNoDataSourceInspection
// Object.defineProperty(exports, "__esModule", { value: true });

//import * as sql_layer_1 from "/opt/core/sql-layer";
import SQLManager from '/opt/core/SQLManager';

//const sql_layer_1 = require("/opt/sql-layer");
//SQLManager.createConnection(true);

import * as error_layer_1 from "/opt/core/NetworkError";
// / const error_layer_1 = require("/opt/customError-layer");

//const AWS = require("/opt/nodejs/node_modules");
// const AWS = require("aws-sdk");
import * as AWS from 'aws-sdk';
//const aws_layer_1 = require("/opt/sdk-layer");
//const AWS = aws_layer_1.SDK.AWS;
AWS.config.update({ region: 'ca-central-1' });
const ses = new AWS.SES();
exports.handler = async function (event) {
    const sourceEmail = 'samuelxingbo@gmail.com';
    // const user = event.body.user;
    const order = event.body.order;
    // const showTable = `SHOW TABLES`;
    // const tables = await SQLManager.query(showTable);
    // console.log(tables);
    const orderId = order.id;
    const sqlGetBuyerId = `SELECT buyer_id FROM dev.orders o WHERE o.id = ${orderId}`;
    const buyerId = (JSON.parse(JSON.stringify(await SQLManager.query(sqlGetBuyerId)))[0]).buyer_id;
    const sqlGetBuyerName = `SELECT first_name FROM dev.user u WHERE u.id = ${buyerId}`;
    const buyerName = (JSON.parse(JSON.stringify(await SQLManager.query(sqlGetBuyerName))))[0].first_name;
    const sqlGetBuyerEmail = `SELECT email FROM dev.user u WHERE u.id = ${buyerId}`;
    const destinationEmail = (JSON.parse(JSON.stringify(await SQLManager.query(sqlGetBuyerEmail))))[0].email;
    const sqlGetOrderItems = `SELECT * from dev.order_item oi WHERE oi.order_id = ${orderId}`;
    const orderItems = (JSON.parse(JSON.stringify(await (SQLManager.query(sqlGetOrderItems)))));
    
    let emailBody = `<h1> Hello! ${buyerName} </h1> <br> <h3>Good news! Your recent order: #${orderId} has been <b>shipped! </b> </h3> <h2> Order details: </h2><br>`;
    const emailEnd = `<br> Best Regards, <br> Jungle Cart Team <br> <b><a href="https://main.d80mxyatc2g3o.amplifyapp.com/products?page=1"> Click here to go to home page </a></b>`;

    const shipped = 3;

    
    
    let tempShippingStatusId = 0;
    let tempProductId = 0;
    let tempQueryResult = null;
    
    let sqlUpdateOrderStatus = `UPDATE dev.orders SET order_status_id = ${shipped} WHERE id = ${orderId}`;
    await SQLManager.query(sqlUpdateOrderStatus);
    
    let sqlUpdateShippingStatus = `UPDATE dev.shipping_status SET status = 'shipped' WHERE id = ${tempShippingStatusId}`;
    let sqlGetProductName = `SELECT name FROM dev.product WHERE id=${tempProductId}`;
    for (let i = 0; i < orderItems.length; i++) {
        //adds product name to the email body and modify shipping status
        tempShippingStatusId = orderItems[i].shipping_status_id;
        sqlUpdateShippingStatus = `UPDATE dev.shipping_status SET status = 'shipped' WHERE id = ${tempShippingStatusId}`;
        
        await SQLManager.query(sqlUpdateShippingStatus);
        tempProductId = orderItems[i].product_id;
        sqlGetProductName = `SELECT name FROM dev.product WHERE id=${tempProductId}`;
        tempQueryResult = (JSON.parse(JSON.stringify(await SQLManager.query(sqlGetProductName))))[0].name;
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
        Source: sourceEmail,
        ReplyToAddresses: [
            sourceEmail,
        ],
    };
    const res = await ses.sendEmail(params).promise().then(result => {
        console.log("successfully sent the email");
        console.log(result);
    });



    let deliveryEmailBody = `<h1> Hello! ${buyerName} </h1> <br> <h3>Thank you for waiting! Your package for recent order: #${orderId} has been <b>delivered! </b> </h3> <h2> Order details: </h2><br>`;

    const completed = 4;

    setTimeout(function() {

        // code to be executed after 5 seconds
      
      }, 10000);
    
    tempShippingStatusId = 0;
    tempProductId = 0;
    tempQueryResult = null;
    
    sqlUpdateOrderStatus = `UPDATE dev.orders SET order_status_id = ${completed} WHERE id = ${orderId}`;
    await SQLManager.query(sqlUpdateOrderStatus);
    
    for (let i = 0; i < orderItems.length; i++) {
        //adds product name to the email body and modify shipping status
        tempShippingStatusId = orderItems[i].shipping_status_id;
        sqlUpdateShippingStatus = `UPDATE dev.shipping_status SET status = 'delivered' WHERE id = ${tempShippingStatusId}`;
        
        await SQLManager.query(sqlUpdateShippingStatus);
        tempProductId = orderItems[i].product_id;
        sqlGetProductName = `SELECT name FROM dev.product WHERE id=${tempProductId}`;
        tempQueryResult = (JSON.parse(JSON.stringify(await SQLManager.query(sqlGetProductName))))[0].name;
        deliveryEmailBody += `<h3> ${tempQueryResult} * ${orderItems[i].quantity} </h3> <br>`;
    }
    deliveryEmailBody += emailEnd;
    const deliveryEmailParams = {
        Destination: {
            ToAddresses: [
                destinationEmail,
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: deliveryEmailBody
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
        Source: sourceEmail,
        ReplyToAddresses: [
            sourceEmail,
        ],
    };
    const deliveryRes = await ses.sendEmail(deliveryEmailParams).promise().then(result => {
        console.log("successfully sent the delivery email");
        console.log(result);
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Shipping and delivery completed successfully' }),
    };
};
