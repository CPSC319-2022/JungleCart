import { Admin } from '../../utils/types';
import AdminService from './service';
import { Request, Response, Result } from '/opt/common/router';
import NetworkError from '/opt/common/network-error';

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
  const pbody = JSON.parse(Request.body);
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

export async function addAdmins(Request, Response) {
  const adminId = Request.params.adminId;
  await checkAdminAuth(adminId);
  const info: Admin = JSON.parse(Request.body);
  const rst = await AdminService.addAdmins(info);
  return Response.status(200).send(rst);
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

// async function RequestValidation(e) {
//   if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
//     if (!e.pathParameters.userId || !e.body)
//       throw NetworkError.BAD_REQUEST.msg('no user id');
//   } else {
//     if (!e.pathParameters.userId || !e.pathParameters.adminId)
//       throw NetworkError.BAD_REQUEST.msg('missing parameter');
//   }
// }

export class Unauthorized extends NetworkError {
  statusCode = 401;
}
