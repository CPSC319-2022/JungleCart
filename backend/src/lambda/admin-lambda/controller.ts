import { Admin } from '../../utils/types';
import AdminService from './service';
import { Request, Response, Result } from '/opt/common/router';
import NetworkError from '/opt/common/network-error';

export async function getUsers(e) {
  await requestValidation(e);
  const adminId = e.pathParameters.adminId;
  await checkAdminAuth(adminId);
  return await AdminService.getUsers();
}

export async function getAdminById(e) {
  console.log('!!!!!!!! here');
  await requestValidation(e);
  const adminId = e.pathParameters.adminId;
  await checkAdminAuth(adminId);
  return await AdminService.getAdminById(adminId);
}

export async function addUser(e) {
  await requestValidation(e);
  const adminId = e.pathParameters.adminId;
  const pbody = JSON.parse(e.body);
  await checkAdminAuth(adminId);
  await isEmailExist(pbody);
  return await AdminService.addUser(pbody.email);
}

export async function deleteUserById(e) {
  await requestValidation(e);
  const adminId = e.pathParameters.adminId;
  const uid = e.pathParameters.userId;
  await checkAdminAuth(adminId);
  const user = await AdminService.deleteUserById(uid);
  if (user.affectedRows == 1) {
    return { message: `user '${uid}' removed from the user` };
  } else {
    throw NetworkError.NOT_FOUND('User not found');
  }
}

export async function addAdmins(e) {
  await requestValidation(e);
  const adminId = e.pathParameters.adminId;
  await checkAdminAuth(adminId);
  const info: Admin = JSON.parse(e.body);
  return await AdminService.addAdmins(info);
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

async function requestValidation(e) {
  if (e.httpMethod == 'POST' || e.httpMethod == 'PUT') {
    if (!e.pathParameters.userId || !e.body)
      throw NetworkError.BAD_REQUEST.msg('no user id');
  } else {
    if (!e.pathParameters.userId)
      throw NetworkError.BAD_REQUEST.msg('no user id');
  }
}

export class Unauthorized extends NetworkError {
  statusCode = 401;
}
