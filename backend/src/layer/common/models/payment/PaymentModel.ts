import SQLManager from '../../core/SQLManager';

class PaymentModel {
  public async getPayment(bid) {
    const sql = `SELECT * FROM payment_method WHERE id = ?`;
    return await SQLManager.query(sql, [bid]);
  }
}

export default new PaymentModel();
