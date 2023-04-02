// import Router, { ResponseContent } from '/opt/core/Router';
// import * as AWS from '@aws-sdk/client-cognito-identity-provider';
// const client = new AWS.CognitoIdentityProvider({ region: ' ca-central-1' });

// export async function preSignup(event) {
//   if (
//     event.callerContext.clientId === 'user-pool-app-client-id-to-be-blocked'
//   ) {
//     throw new Error('Cannot authenticate users from this user pool app client');
//   }
//   const userInfo = {
//     firstName: '',
//     lastName: '',
//     department_id: -1,
//     email: '',
//   };
//   if (
//     Object.prototype.hasOwnProperty.call(
//       event.request.userAttributes,
//       'first_name'
//     )
//   ) {
//     userInfo.firstName = event.request.userAttributes.first_name;
//   }
//   if (
//     Object.prototype.hasOwnProperty.call(
//       event.request.userAttributes,
//       'last_name'
//     )
//   ) {
//     userInfo.lastName = event.request.userAttributes.last_name;
//   }
//   if (
//     Object.prototype.hasOwnProperty.call(
//       event.request.userAttributes,
//       'department_id'
//     )
//   ) {
//     userInfo.department_id = event.request.userAttributes.department_id;
//   }

//   if (
//     Object.prototype.hasOwnProperty.call(event.request.userAttributes, 'email')
//   ) {
//     userInfo.email = event.request.userAttributes.email;
//   }

//   // const { User } = await client
//   //   .listUsers(params)
//   //   .promise();
// }
