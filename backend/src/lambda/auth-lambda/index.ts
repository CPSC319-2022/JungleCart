import { SQLConnectionManager } from '/opt/sql-layer';
SQLConnectionManager.createConnection(true);

// handles routing and sends request
exports.handler = async function (event) {
  return authorizeLogin(event);
};

// handlers
export async function authorizeLogin(event): Promise<any> {
  let userEmail;
  try {
    userEmail = event.request.userAttributes.email;
  } catch (e) {
    throw new Error('Missing Email');
  }
  const sql = 'SELECT email FROM dev.user WHERE email = ?';

  const response = await SQLConnectionManager.query(sql, [userEmail]);
  const rows = response as unknown as any[];
  if (rows.length > 0) {
    return event;
  } else {
    console.log(`${userEmail} not in db`);
    throw new Error('NOT USER');
  }
}
