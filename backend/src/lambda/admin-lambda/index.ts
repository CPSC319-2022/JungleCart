// import {
//   query,
//   Router,
//   createConnection,
// } from '/opt/nodejs/node_modules/sql-layer';
const {
  query,
  Router,
  createConnection,
} = require('/opt/nodejs/node_modules/sql-layer');

const router = new Router();
import { User } from '../../utils/types';

router.get('/admins/{adminId}', getAdminInfo);
router.post('/admins/{adminId}/users', addUser);
router.get('/admins/{adminId}/users', getUsers);
router.delete('/admins/{adminId}/users/{userId}', deleteUser);
router.get('/admins/{adminId}/dashboard', getAdminDashboard);

createConnection(
  process.env.RDS_HOSTNAME,
  process.env.RDS_USERNAME,
  process.env.RDS_PASSWORD,
  process.env.RDS_PORT
);

exports.handler = async (e) => {
  return await router.route(e);
};

async function getAdminInfo(e): Promise<response> {
  if (!e.pathParameters)
    return { statusCode: 400, body: 'getadminInfo - No id' };
  console.log(e.pathParameters.adminId);
  const aid = e.pathParameters.adminId;
  // await checkAdminAuth(aid);
  const sql = 'SELECT * FROM sqlDB.user WHERE id = ?';
  // return queryProcessor(e.requestContext.httpMethod, e, sql, [aid]);
  return await query(sql, [aid])
    .then((results) => ({
      statusCode: 200,
      body: results,
    }))
    .catch((error) => ({
      statusCode: 400,
      body: error.message,
    }));
}

async function addUser(e): Promise<response> {
  const aid = e.adminId;
  await checkAdminAuth(aid);
  const email = e.params.email;
  await isEmailExist(email);
  const info: User = { email: email };
  const sql = 'INSERT INTO sqlDB.user SET ?';
  return queryProcessor(e.requestContext.httpMethod, e, sql, [info]);
}

async function getUsers(e): Promise<response> {
  const aid = e.adminId;
  await checkAdminAuth(aid);
  const sql = `SELECT JSON_OBJECT(
    'admin', (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id', a.id,
                'first_name', a.first_name,
                'last_name', a.last_name,
                'department', a.department,
                'email', a.email
            )) FROM sqlDB.user a WHERE a.id_admin = 1),
    'user', (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', u.id,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'department', u.department,
                'email', u.email
                )) FROM sqlDB.user u WHERE u.id_admin = 0)) as combined`;
  return queryProcessor(e.requestContext.httpMethod, e, sql);
}

async function deleteUser(e): Promise<response> {
  const aid = e.adminId;
  await checkAdminAuth(aid);
  const uid = e.userId;
  await isIdExist(uid);
  const sql = 'DELETE FROM sqlDB.user WHERE id = ?';
  return queryProcessor(e.requestContext.httpMethod, e, sql, [uid]);
}

async function getAdminDashboard(e) {
  const aid = e.adminId;
  // await checkAdminAuth(aid);
  // const bid = e.userId;
  // const id = e.id;
  // const sql = 'DELETE FROM cart_item WHERE buyer_id = ? AND product_id = ?';
  // return queryProcessor(e.requestContext.httpMethod, e, sql);
}

const checkAdminAuth = async function (aid): Promise<response> {
  const sql = 'SELECT COUNT(*) FROM sqlDB.user WHERE is_admin = 1 AND id = ?';
  return query(sql, [aid])
    .then((results) => {
      if (JSON.parse(JSON.stringify(results))[0]['COUNT(*)'] === 0) {
        throw new Error('unauthorized!');
      } else return;
    })
    .catch((error) => ({
      statusCode: error.statusCode,
      body: error.message,
    }));
};

async function isIdExist(uid): Promise<response> {
  const sql = 'SELECT COUNT(*) FROM sqlDB.user WHERE id = ?';
  return query(sql, [uid])
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

const isEmailExist = async function (email): Promise<response> {
  const sql = 'SELECT COUNT(*) FROM sqlDB.user WHERE email = ?';
  return query(sql, [email])
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

const queryProcessor = async function (
  m,
  e,
  sql: string,
  param?
): Promise<response> {
  if (m == 'POST' || m == 'PUT') {
    if (!e.userId || !e.body) return { statusCode: 400, body: 'no user id' };
  } else {
    if (!e.userId) return { statusCode: 400, body: e.body };
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

type response = { statusCode: number; body: object | string };
