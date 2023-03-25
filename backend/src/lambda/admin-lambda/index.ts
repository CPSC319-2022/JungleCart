import { asyncWrap } from '/opt/common/async-wrap';
import NetworkError from '/opt/common/network-error';
import {
  getUsers,
  addUser,
  deleteUserById,
  getAdminById,
  getAdminDashboard,
} from './controller';
import { Router } from '/opt/common/router';

const router: Router = new Router();
exports.handler = async (e) => {
  return await router.route(e);
};

router.get('/admins/{adminId}', getAdminById);
router.post('/admins/{adminId}/users', asyncWrap(addUser));
router.get('/admins/{adminId}/users', asyncWrap(getUsers));
router.delete('/admins/{adminId}/users/{userId}', asyncWrap(deleteUserById));
router.get('/admins/{adminId}/dashboard', asyncWrap(getAdminDashboard));

// util
// function handling(controller) {
//   return async (Request, Response) => {
//     try {
//       const result = await controller(Request, Response);
//       const statusCode = result.statusCode || 200;
//       return Response.status(statusCode).send(JSON.stringify(result));
//     } catch (err) {
//       console.log(err);
//       return;
//       // return { statusCode: err.statusCode, body: err.message };
//     }
//   };
// }

// async function getAdminL(e) {
//   await requestValidation(e);
//   return await getAdminById(e);
// }

// async function getUsersL(e) {
//   await requestValidation(e);
//   return await getUsers(e);
// }

// async function addUserL(e) {
//   await requestValidation(e);
//   return await addUser(e);
// }

// async function deleteUserL(e) {
//   await requestValidation(e);
//   return await deleteUserById(e);
// }

// async function getAdminDashboardL(e) {
//   await requestValidation(e);
//   return await getAdminDashboard(e);
// }

// async function requestValidation(e) {
//   if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
//     if (!e.pathParameters.adminId || !e.body)
//       throw new NetworkError.BadRequest();
//   } else if (e.httpMethod == 'DELETE') {
//     if (!e.pathParameters.adminId || !e.pathParameters.userId)
//       throw new NetworkError.BadRequest();
//   } else {
//     if (!e.pathParameters.adminId) throw new NetworkError.BadRequest();
//   }
// }
