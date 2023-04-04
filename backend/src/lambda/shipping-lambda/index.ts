// noinspection SqlNoDataSourceInspection
// Object.defineProperty(exports, "__esModule", { value: true });

//import * as sql_layer_1 from "/opt/core/sql-layer";
import SQLManager from '/opt/core/SQLManager';

import * as error_layer_1 from '/opt/core/NetworkError';
import * as AWS from 'aws-sdk';
//const aws_layer_1 = require("/opt/sdk-layer");
//const AWS = aws_layer_1.SDK.AWS;
AWS.config.update({ region: 'ca-central-1' });
const ses = new AWS.SES();
exports.handler = async function (event) {
  const sourceEmail = 'junglecart.test@gmail.com';
  const order = event.body.order;
  const orderId = order.id;
  const sqlScript = `SELECT u.first_name, u.email, p.name, oi.quantity, os.LABEL, ss.status FROM dev.user u, dev.order_item oi, dev.product p, dev.orders o, dev.order_status os, dev.shipping_status ss WHERE o.id = ${orderId} AND o.id = oi.order_id AND p.id = oi.product_id AND o.buyer_id = u.id AND o.order_status_id = os.ID AND ss.id = oi.shipping_status_id;`;
  const result = JSON.parse(JSON.stringify(await SQLManager.query(sqlScript)));
  const buyerName = result[0].first_name;
  const orderStatus = result[0].LABEL;
  let emailBody = `<h1> Hello! ${buyerName} </h1> <br> <h3>The state of your recent order: #${orderId} is now <b> -${orderStatus}- </b> </h3> <h2> Order details: </h2><br>`;
  for (let i = 0; i < result.length; i++) {
    emailBody += `<h3> ${result[i].name} * ${result[i].quantity} </h3> <h3><b> Item status: -${result[i].status}- </b></h3> <br>`;
  }
  const emailEnd = `<br> Best Regards, <br> Jungle Cart Team <br> <b><a href="https://main.d80mxyatc2g3o.amplifyapp.com/products?page=1"> Click here to go to home page </a></b>`;
  emailBody += emailEnd;
  const destinationEmail = result[0].email;
  const params = {
  Destination: {
    ToAddresses: [destinationEmail],
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: emailBody,
      },
      Text: {
        Charset: 'UTF-8',
        Data: 'Hello!',
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Hi! There is an update to an order of yours',
    },
  },
  Source: sourceEmail,
  ReplyToAddresses: [sourceEmail],
  };

  const res = await ses
    .sendEmail(params)
    .promise()
    .then((result) => {
      console.log('successfully sent a confirmation email');
      console.log(result);
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Email sent successfully; Database updated',
    }),
  };
};
