import { Payment_method } from '../../utils/types';
import NetworkError from '/opt/core/NetworkError';
import PaymentService from '/opt/services/payment';

export async function checkCardValidation(Request, Response) {
  const uid = Request.params.userId;
  const pid = await PaymentService.checkPaymentExist(uid);
  const payment: Payment_method = await PaymentService.getPayment(pid);
  isCardValid(payment);
  return Response.status(200).send();
}

export function isCardValid(payment: Payment_method) {
  !payment.is_paypal ? checkCredit(payment) : true;
}

function checkCredit(payment) {
  checkCardNum(payment.cardnum);
  checkExpiry(payment.expiration_date);
  checkName(payment.first_name, payment.last_name);
}

function checkCardNum(cardNum) {
  if (!Number(cardNum) || cardNum.charAt(0) === '0' || cardNum.length !== 16) {
    throw NetworkError.BAD_REQUEST.msg('Invalid Card number');
  }
}

function checkExpiry(date) {
  if (new Date(date) < new Date()) {
    throw NetworkError.BAD_REQUEST.msg('Card is already expired!');
  }
}

function checkName(first, last) {
  const pattern = /^[A-Za-z]+$/;
  if (!pattern.test(first) || !pattern.test(last)) {
    throw NetworkError.BAD_REQUEST.msg('The name of card owner is invalid');
  }
}
