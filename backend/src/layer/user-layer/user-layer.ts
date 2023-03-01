/* eslint-disable @typescript-eslint/no-var-requires */
//const { UserService } = require('/opt/nodejs/node_modules/user-layer');
import * as console from 'console';
import UserService from './service';
type res = { statusCode: number; body: object | string };

export async function listUsers(event): Promise<res> {
  const users = await UserService.listUsers();
  return { statusCode: 200, body: users };
}

export async function addUser(event) {
  const newUser = event.body;
  const user = await UserService.addUser(newUser);
  return { statusCode: 200, body: user };
}

export async function getUserInfoById(event) {
  const userId = Number(event.pathParameters.userId);
  const user = await UserService.getUserInfoById(userId);
  return { statusCode: 200, body: user };
}

export async function getBuyerInfo(event) {
  const userId = Number(event.pathParameters.userId);
  const buyer = await UserService.getBuyerInfo(userId);
  console.log('buyer : ', buyer);
  return { statusCode: 200, body: buyer };
}

export async function getSellerInfo(event) {
  const userId = Number(event.pathParameters.userId);
  const seller = await UserService.getSellerInfo(userId);
  return { statusCode: 200, body: seller };
}

export async function updateUserInfoById(event) {
  const userInfo = event.body;
  const userId = Number(event.pathParameters.userId);
  await UserService.updateUserInfoById(userId, userInfo);
  return {
    statusCode: 200,
    body: { message: 'updated user info' },
  };
}
// Address
export async function getAddresses(event) {
  const userId = event.pathParameters.userId;
  const addresses = await UserService.getAddresses(userId);
  return { statusCode: 200, body: addresses };
}

export async function getAddressesByUserId(event) {
  const userId = event.pathParameters.userId;
  const address = await UserService.getAddressesByUserId(userId);
  return { statusCode: 200, body: address };
}

export async function addAddress(event) {
  const newAddress = event.body;
  const addressId = await UserService.addAddress(newAddress);
  return { statusCode: 200, body: addressId };
}

export async function deleteAddressById(event) {
  const { userId, addressId } = event.pathParameters;
  await UserService.deleteAddressById(userId, addressId);
  return { statusCode: 200, body: { message: 'deleted address' } };
}

export async function updateAddressById(event) {
  const { userId, addAddressId } = event.pathParameters;
  const addInfo = event.body;
  await UserService.updateAddressById(addAddressId, addInfo);
  return { statusCode: 200, body: { message: 'updated address' } };
}
