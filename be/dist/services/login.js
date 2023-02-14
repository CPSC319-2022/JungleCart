"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const SECRET_KEY = process.env.SECRET_KEY
// const salt = bcrypt.genSaltSync()
// const doesUserExist = async (email: string) => {
//   const user = await UserModel.readUserByEmail(email)
//   return user
// }
// const validateEmail = (email: string) => {
//   return String(email)
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     )
// }
// const isInputValid = (userInfo: dto.User, option?: string) => {
//   let msg = ''
//   if (!userInfo) {
//     msg = 'INVALID_USER_INFO'
//   }
//   if (!validateEmail(userInfo.email)) {
//     msg = `EMAIL_NOT_VALID`
//   }
//   if (option === 'signup') {
//     if (userInfo.first_name == null || userInfo.last_name?.length < 2) {
//       msg = 'USER_NAME_REQUIRED. user_name.length > 1'
//     }
//   }
//   if (msg != '') {
//     errorGenerator({ message: msg, statusCode: 400 })
//   }
// }
// const createToken = async (userId: number) => {
//   try {
//     const token = jwt.sign({ id: userId }, SECRET_KEY as string, {
//       expiresIn: '24h',
//     })
//     return token
//   } catch (err) {
//     const msg = 'CREATE_TOKEN_FAILED'
//     errorGenerator({ message: msg, statusCode: 400 })
//   }
// }
// const terminateToken = async (jungleCartToken: TokenObj['jungleCartToken']) => {
//   const tokenExist = await UserModel.readToken(jungleCartToken)
//   if (tokenExist) {
//     await UserModel.removeToken(jungleCartToken)
//   }
// }
// const tokenToDB = async (tokenObj: TokenObj) => {
//   await UserModel.storeToken(tokenObj)
//   setTimeout(async () => {
//     await terminateToken(tokenObj.jungleCartToken)
//   }, 1000 * 60 * 60)
// }
