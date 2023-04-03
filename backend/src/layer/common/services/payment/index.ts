import NetworkError from '/opt/core/NetworkError';
import { Payment_method } from '../../../../utils/types';
import PaymentModel from '../../models/payment/PaymentModel';

class PaymentService {
  public async checkPaymentExist(bid) {
    const count = await PaymentModel.checkPaymentExist(bid);
    if (JSON.parse(JSON.stringify(count))[0]['COUNT(*)'] !== 0) {
      throw NetworkError.BAD_REQUEST.msg('Payment Id is not set');
    } else {
      const rst = JSON.parse(
        JSON.stringify(await PaymentModel.getPaymentId(bid))
      )[0].pref_pm_id;
      return rst;
    }
  }

  public async getPayment(pid): Promise<Payment_method> {
    const rst = await PaymentModel.getPayment(pid);
    const payment: Payment_method = JSON.parse(JSON.stringify(rst))[0];
    return payment;
  }
}

export default new PaymentService();
