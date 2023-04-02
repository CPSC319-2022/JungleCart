import {
  getUsers,
  deleteUserById,
  getAdminById,
  changeAdminsStatus,
} from './controller';
import Router from '/opt/core/Router';
import NetworkError from '/opt/core/NetworkError';

const router: Router = new Router();
exports.handler = async (e) => {
  requestValidation(e);
  return await router.route(e);
};

router.get('/admins/{adminId}', handling(getAdminById));
// router.post('/admins/{adminId}/users', handling(addAdmins));
router.put('/admins/{adminId}', handling(changeAdminsStatus));
router.get('/admins/{adminId}/users', handling(getUsers));
router.delete('/admins/{adminId}/users/{userId}', handling(deleteUserById));

// util
function handling(controller) {
  return async (Request, Response) => {
    try {
      return await controller(Request, Response);
    } catch (err) {
      const error = err as NetworkError;
      return Response.status(400).send(error.message);
    }
  };
}

async function requestValidation(e) {
  if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
    if (!e.pathParameters.adminId || !e.body) throw NetworkError.BAD_REQUEST;
  } else if (e.httpMethod == 'DELETE') {
    if (!e.pathParameters.adminId || !e.pathParameters.userId)
      throw NetworkError.BAD_REQUEST;
  } else {
    if (!e.pathParameters.adminId) throw NetworkError.BAD_REQUEST;
  }
}
