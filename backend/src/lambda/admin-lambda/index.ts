import { Router, BadRequest } from '/opt/sql-layer';
import {
  getUsers,
  addUser,
  deleteUserById,
  getAdminById,
  getAdminDashboard,
} from './admin-controller';
const router = new Router();

exports.handler = async (e) => {
  const handlerResult = await router.route(e);
  console.log('handlerResult :: ', handlerResult);
  return handlerResult;
};

router.get('/admins/{adminId}', handling(getAdminL));
router.post('/admins/{adminId}/users', handling(addUserL));
router.get('/admins/{adminId}/users', handling(getUsersL));
router.delete('/admins/{adminId}/users/{userId}', handling(deleteUserL));
router.get('/admins/{adminId}/dashboard', handling(getAdminDashboardL));

// util
function handling(handler) {
  return async (event) => {
    try {
      const result = await handler(event);
      return {
        statusCode: result.statusCode || 200,
        body: JSON.stringify(result),
      };
    } catch (err) {
      console.log(err);
      return;
    }
  };
}

async function getAdminL(e) {
  await requestValidation(e);
  return await getAdminById(e);
}

async function getUsersL(e) {
  await requestValidation(e);
  return await getUsers(e);
}

async function addUserL(e) {
  await requestValidation(e);
  return await addUser(e);
}

async function deleteUserL(e) {
  await requestValidation(e);
  return await deleteUserById(e);
}

async function getAdminDashboardL(e) {
  await requestValidation(e);
  return await getAdminDashboard(e);
}

async function requestValidation(e) {
  if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
    if (!e.pathParameters.adminId || !e.body)
      throw new BadRequest('no admin id');
  } else if (e.httpMethod == 'DELETE') {
    if (!e.pathParameters.adminId || !e.pathParameters.userId)
      throw new BadRequest('no parameter');
  } else {
    if (!e.pathParameters.adminId) throw new BadRequest('no admin id');
  }
}
