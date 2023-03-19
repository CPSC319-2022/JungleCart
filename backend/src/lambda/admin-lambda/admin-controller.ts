import { Admin } from '../../utils/types';
import AdminService from './admin-service';
import { NetworkError, BadRequest, NotFoundError } from '/opt/common//sql-layer';

export async function getUsers(e) {
  const adminId = e.pathParameters.adminId;
  await checkAdminAuth(adminId);
  return await AdminService.getUsers();
}

export async function getAdminById(e) {
  const adminId = e.pathParameters.adminId;
  await checkAdminAuth(adminId);
  return await AdminService.getAdminById(adminId);
}

export async function addUser(e) {
  const adminId = e.pathParameters.adminId;
  const pbody = JSON.parse(e.body);
  await checkAdminAuth(adminId);
  await isEmailExist(pbody);
  return await AdminService.addUser(pbody.email);
}

export async function deleteUserById(e) {
  const adminId = e.pathParameters.adminId;
  const uid = e.pathParameters.userId;
  await checkAdminAuth(adminId);
  const user = await AdminService.deleteUserById(uid);
  if (user.affectedRows == 1) {
    return { message: `user '${uid}' removed from the user` };
  } else {
    throw new NotFoundError('User not found');
  }
}

export async function addAdmins(e) {
  const adminId = e.pathParameters.adminId;
  await checkAdminAuth(adminId);
  const info: Admin = JSON.parse(e.body);
  return await AdminService.addAdmins(info);
}

export async function getAdminDashboard(e) {
  const adminId = e.pathParameters.adminId;
  await checkAdminAuth(adminId);
  return await AdminService.getAdminDashboard(adminId);
}

async function checkAdminAuth(adminId) {
  if (!(await AdminService.checkAdminAuth(adminId))) {
    throw new Unauthorized('UNAUTHORIZED USER');
  }
}

async function isEmailExist(body) {
  if (!body.email) {
    throw new BadRequest('request invalid');
  }
  if (!(await AdminService.isEmailExist(body.email))) {
    throw new BadRequest('email already exist');
  }
}

export class Unauthorized extends NetworkError {
  statusCode = 401;
}
