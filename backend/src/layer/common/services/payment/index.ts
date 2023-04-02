import NetworkError from '/opt/core/network-error';
import { Payment_method } from '../../../../utils/types';
import PaymentModel from '../../models/payment/paymentModel';

class PaymentService {
  public async getPayment(pid): Promise<Payment_method> {
    const rst = await PaymentModel.getPayment(pid);
    const payment: Payment_method = JSON.parse(JSON.stringify(rst))[0];
    return payment;
  }
}

export default new PaymentService();
