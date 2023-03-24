import { SQLManager } from '/opt/common/SQLManager';
import { IOrder } from "@/lambdas/order-lambda/orderRequest";
SQLConnectionManager.connect(true);

// handles routing and sends request
exports.handler = async function (event) {
  return handleOrder(event);
};

// handlers
export async function handleOrder(event): Promise<any> {
  const request = event as IOrder;
  console.log(request);



  // let userEmail;
  // try {
  //   userEmail = event.request.userAttributes.email;
  // } catch (e) {
  //   throw new Error('Missing Email');
  // }
  // const sql = 'SELECT email FROM dev.user WHERE email = ?';
  //
  // const response = await SQLConnectionManager.query(sql, [userEmail]);
  // const rows = response as any[];
  // if (rows.length > 0) {
  //   return event;
  // } else {
  //   console.log(`${userEmail} not in db`);
  //   throw new Error('NOT USER');
  // }
}

