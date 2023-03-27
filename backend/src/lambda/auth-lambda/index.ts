import SQLManager from '/opt/core/SQLManager';

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

  const response = await SQLManager.query(sql, [userEmail]);
  const rows = response as any[];
  if (rows.length > 0) {
    return event;
  } else {
    console.log(`${userEmail} not in db`);
    throw new Error('NOT USER');
  }
}
