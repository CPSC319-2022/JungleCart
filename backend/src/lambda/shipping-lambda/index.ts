// noinspection SqlNoDataSourceInspection
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const {query, Router, createConnection} = require("/opt/nodejs/node_modules/sql-layer");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {createTransporter, formMailOptions, sendEmail} = require("/opt/nodejs/node_modules/ses-layer");

//const ses = new AWS.SES();


createConnection(process.env.RDS_HOSTNAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, process.env.RDS_PORT);

// exports.handler = async function (event) {
//   const sourceEmail = 'junglecart.test@gmail.com';
//   const user = event.body.user;
//   const order = event.body.order;
//   let sqlCreateShippingStatus = '';
//   const shipped = 3;
//   const sqlUpdateOrderStatus = 'UPDATE order_status SET order_status_id = ${shipped} WHERE id = ${order.id}';
//   let sqlLinkOrderItemToShippingStatus = '';
//   let lastInsert = 0;
//   for (let i = 0 ; i < order.order_item.length; i++) {
//     sqlCreateShippingStatus = `INSERT INTO shipping_status (STATUS, EXPECTED_DELIVERY_DATE) VALUES ('shippied', ${order.order_item[i].expectedDate});`;
//     query(sqlCreateShippingStatus, (error, results) => {
      
//       if (error) {
//         console.error('Error executing query:', error);
//         return;
//       }
//       lastInsert = results.insertId;
//       sqlLinkOrderItemToShippingStatus = 'UPDATE order_item SET shipping_status_id = ${lastInsert} WHERE id = ${order.order_item[i]}';
//       query(sqlLinkOrderItemToShippingStatus);
//     });
//   }
  
//   query(sqlUpdateOrderStatus);

//   const transporter = createTransporter();
//   const mailOptions = formMailOptions(
//     sourceEmail, 
//     user.email, 
//     "Thank you! Your order has been shipped.",
//     "Hello!\nYour order ${order.id} has been shipped. \n Best Regards, \n Jungle Cart Team");
//   sendEmail(transporter, mailOptions);
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: 'Shipping completed successfully' }),
//   };
// };
