import SQLManager from '../../core/SQLManager';

class PaymentModel {
  public async getPayment(bid) {
    const sql = `SELECT * FROM dev.payment_method WHERE id = ?`;
    return await SQLManager.query(sql, [bid]);
  }

  public async checkPaymentExist(bid) {
    const sql = `SELECT COUNT(*) FROM dev.buyer WHERE id = ? AND pref_pm_id IS NULL`;
    return await SQLManager.query(sql, [bid]);
  }

  public async getPaymentId(bid) {
    const sql = `SELECT pref_pm_id FROM dev.buyer WHERE id = ?`;
    return await SQLManager.query(sql, [bid]);
  }
}

export default new PaymentModel();
