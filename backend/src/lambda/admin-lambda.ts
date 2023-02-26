import {
  query,
  Router,
  createConnection,
} from '/opt/nodejs/node_modules/sql-layer';
const router = new Router(process.env as { [key: string]: string });
import { User } from '../utils/types';

router.get('/', getAdminInfo);
router.post('/users', addUser);
router.get('/users', getUsers);
router.delete('/users/:userId', deleteUser);
router.get('/dashboard', getAdminDashboard);

createConnection(
  process.env.RDS_HOSTNAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  process.env.RDS_PORT
);

exports.handler = async (e) => {
  return await router.route(e);
};

async function getAdminInfo(e) {
  const aid = e.adminId.slice(1);
  // await checkAdminAuth(aid);
  const sql = 'SELECT * FROM admin WHERE id = ?';
  return queryProcessor(e.requestContext.httpMethod, e, sql, [aid]);
}

async function addUser(e) {
  const aid = e.adminId.slice(1);
  // await checkAdminAuth(aid);
  const email = e.params.email;
  await isEmailExist(email);
  const info: User = { email: email };
  const sql = 'INSERT INTO user SET ?';
  return queryProcessor(e.requestContext.httpMethod, e, sql, [info]);
}

async function getUsers(e) {
  const aid = e.adminId.slice(1);
  // await checkAdminAuth(aid);
  const sql = `SELECT JSON_OBJECT(
    'admin', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', a.id,
                'first_name', a.first_name,
                'last_name', a.last_name,
                'department', a.department,
                'email', a.email
            )) FROM admin a),
    'user', (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', u.id,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'department', u.department,
                'email', u.email
                )) FROM user u)) as combined`;
  return queryProcessor(e.requestContext.httpMethod, e, sql);
}

async function deleteUser(e) {
  const aid = e.adminId.slice(1);
  // await checkAdminAuth(aid);
  const uid = e.userId.slice(1);
  await isIdExist(uid);
  const sql = 'DELETE FROM user WHERE id = ?';
  return queryProcessor(e.requestContext.httpMethod, e, sql, [uid]);
}

async function getAdminDashboard(e) {
  const aid = e.adminId.slice(1);
  // await checkAdminAuth(aid);
  // const bid = e.userId.slice(1);
  // const id = e.id.slice(1);
  // const sql = 'DELETE FROM cart_item WHERE buyer_id = ? AND product_id = ?';
  // return queryProcessor(e.requestContext.httpMethod, e, sql);
}

const checkAdminAuth = async function (aid) {
  //
};

async function isIdExist(uid) {
  const sql = 'SELECT COUNT(*) FROM user WHERE id = ?';
  const rst = query(sql, [uid])
    .then((results) => {
      if (JSON.parse(JSON.stringify(results))[0]['COUNT(*)'] === 0) {
        throw new Error('no such id');
      } else return;
    })
    .catch((error) => ({
      statusCode: error.statusCode,
      body: error.message,
    }));
}

const isEmailExist = async function (email) {
  const sql = 'SELECT COUNT(*) FROM user WHERE email = ?';
  const rst = query(sql, [email])
    .then((results) => {
      if (JSON.parse(JSON.stringify(results))[0]['COUNT(*)'] !== 0) {
        throw new Error('email already exist');
      } else return;
    })
    .catch((error) => ({
      statusCode: error.statusCode,
      body: error.message,
    }));
};

const queryProcessor = async function (m, e, sql: string, param?) {
  if (m == 'POST' || m == 'PUT') {
    if (!e.userId || !e.body) return { statusCode: 400, body: 'no user id' };
  } else {
    if (!e.userId) return { statusCode: 400, body: 'no user id' };
  }
  return query(sql, param)
    .then((results) => ({
      statusCode: 200,
      body: results,
    }))
    .catch((error) => ({
      statusCode: 400,
      body: error.message,
    }));
};
