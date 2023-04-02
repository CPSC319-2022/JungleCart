import { Admin } from '../../utils/types';
import AdminService from '/opt/services/admin';
import NetworkError from '/opt/core/NetworkError';

export async function getUsers(Request, Response) {
  // await RequestValidation(e);
  const adminId = Request.params.adminId;
  await checkAdminAuth(adminId);
  const rst = await AdminService.getUsers();
  return Response.status(200).send(rst);
}

export async function getAdminById(Request, Response) {
  console.log('Request ::: ', Request);
  const adminId = Request.params.adminId;
  await checkAdminAuth(adminId);
  const rst = await AdminService.getAdminById(adminId);
  return Response.status(200).send(rst);
}

export async function addUser(Request, Response) {
  const adminId = Request.params.adminId;
  const pbody = Request.body;
  await checkAdminAuth(adminId);
  await isEmailExist(pbody);
  const rst = await AdminService.addUser(pbody.email);
  return Response.status(200).send(rst);
}

export async function deleteUserById(Request, Response) {
  const adminId = Request.params.adminId;
  const uid = Request.params.userId;
  await checkAdminAuth(adminId);
  const user = await AdminService.deleteUserById(uid);
  let rst;
  if (user.affectedRows == 1) {
    rst = { message: `user '${uid}' removed from the user` };
  } else {
    throw NetworkError.NOT_FOUND;
  }
  return Response.status(200).send(rst);
}

export async function changeAdminsStatus(Request, Response) {
  const adminId = Request.params.adminId;
  console.log(Request);
  const { user_id } = Request.query;
  const action = Request.body.is_admin;
  await checkAdminAuth(adminId);
  await AdminService.changeAdminsStatus(user_id, action);
  return Response.status(200).send('Successfully updated');
}

export async function getAdminDashboard(e) {
  // const adminId = e.pathParameters.adminId;
  // await checkAdminAuth(adminId);
  // return await AdminService.getAdminDashboard(adminId);
}

async function checkAdminAuth(adminId) {
  if (!(await AdminService.checkAdminAuth(adminId))) {
    throw NetworkError.UNAUTHORIZED;
  }
}

async function isEmailExist(body) {
  if (!body.email) {
    throw NetworkError.BAD_REQUEST;
  }
  if (!(await AdminService.isEmailExist(body.email))) {
    throw NetworkError.BAD_REQUEST;
  }
}

export class Unauthorized extends NetworkError {
  statusCode = 401;
}
