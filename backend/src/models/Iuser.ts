export interface IUserModel {
  addUser(userInfo);

  listUsers();

  getUserInfoById(id);

  updateUserInfoById(id, userInfo);
  // Address
  getAddressesByUserId(user_id);

  getAddresses(id);

  addAddress(addInfo);

  updateAddressById(id, info);

  deleteAddressById(userId, addressId);

  getBuyerInfo(id);

  getSellerInfo(id);

  checkUserIdExist(id);
}
