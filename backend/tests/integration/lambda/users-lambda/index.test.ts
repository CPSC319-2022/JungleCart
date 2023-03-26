// import chai, { expect, should, assert } from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import chaiHttp from 'chai-http';
// import deepEqualInAnyOrder from 'deep-equal-in-any-order';
// import UserController from '@/lambdas/users-lambda/UserController';
// import * as data2 from 'tests/events/user';
// import * as data from 'tests/events/user/event-data';

// chai.use(chaiAsPromised);
// chai.use(chaiHttp);
// chai.use(deepEqualInAnyOrder);

// const CENTRAL_1 =
//   'https://k374937kfi.execute-api.ca-central-1.amazonaws.com/dev/users/';
// const WEST_2 =
//   'https://04kval5632.execute-api.us-west-2.amazonaws.com/prod/users';

// const SERVER_URL = CENTRAL_1;

// describe('Integration tests for User APIs', function () {
//   before(function () {
//     try {
//       //SQLConnectionManager.createConnectionPool(false, true);
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   beforeEach(async () => {
//     //
//   });

//   afterEach(async () => {
//     //
//   });

//   describe('user profile apis', function () {
//     const userId = '1';
//     before(function () {
//       //
//     });
//     it('GET user general info ::: /user/{userId}', async () => {
//       try {
//         const response = await chai.request(SERVER_URL).get(`/${userId}`);
//         console.debug('response :: ', response.body);
//         expect(response.status).to.be.equal(200);
//         expect(response.body).to.deep.equalInAnyOrder(data.getResUser.user);
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });

//     it('GET buyer profile ::: /user/{userId}/buyer', async () => {
//       try {
//         const response = await chai.request(SERVER_URL).get(`/${userId}/buyer`);
//         expect(response.status).to.be.equal(200);
//         expect(response.body.buyer).to.deep.equalInAnyOrder(
//           data.getResBuyer.buyer
//         );
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });

//     it('GET seller profile ::: /user/{userId}/seller', async () => {
//       try {
//         const response = await chai
//           .request(SERVER_URL)
//           .get(`/${userId}/seller`);
//         expect(response.status).to.be.equal(200);
//         delete response.body.seller.id;
//         expect(response.body.seller).to.deep.equalInAnyOrder(
//           data.getResSeller.seller
//         );
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });
//   });
//   describe('user address apis', function () {
//     const userId = '1';
//     let addressId;

//     it(`ADD address as preferred ::: /user/{userId}/addresses`, async () => {
//       const req = JSON.stringify(data.postReqPreferredAddress);
//       const expected = data.postReqPreferredAddress.address;
//       try {
//         const response = await chai
//           .request(SERVER_URL)
//           .post(`/${userId}/addresses`)
//           .send(req)
//           .set('Content-Type', 'application/json');
//         expect(response.status).to.be.equal(200);
//         delete response.body.address.id;
//         console.debug('res body', response.body);
//         expect(response.body.address).to.deep.equalInAnyOrder(expected);
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });

//     it(`GET user's addresses ::: /user/{userId}/addresses`, async () => {
//       try {
//         const expected = data.getResAddresses;
//         const response = await chai
//           .request(SERVER_URL)
//           .get(`/${userId}/addresses`);

//         expect(response.status).to.be.equal(200);
//         console.debug('res ::: ', response.body);
//         expect(response.body.addresses).to.deep.equalInAnyOrder(expected);
//       } catch (err) {
//         console.debug('error ::: ', err);
//         expect.fail();
//       }
//     });

//     it(`UPDATE user's address as non preferred ::: /user/{userId}/buyer`, async () => {
//       try {
//         const expected = data.putReqNonPrefAddress;
//         const req = JSON.stringify(data.putReqNonPrefAddress);
//         const response = await chai
//           .request(SERVER_URL)
//           .put(`/${userId}/addresses/1`)
//           .send(req)
//           .set('Content-Type', 'application/json');

//         expect(response.status).to.be.equal(200);
//         expect(response.body.address).to.deep.equalInAnyOrder(expected.address);
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });

//     it(`ADD address as non preferred ::: /user/{userId}/addresses`, async () => {
//       const req = JSON.stringify(data.postReqNonPreferredAddress);
//       const expected = data.postReqNonPreferredAddress;
//       try {
//         const response = await chai
//           .request(SERVER_URL)
//           .post(`/${userId}/addresses`)
//           .send(req)
//           .set('Content-Type', 'application/json');
//         expect(response.status).to.be.equal(200);
//         const address = response.body.address;
//         delete address.id;
//         expect(address).to.deep.equalInAnyOrder(expected.address);
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });

//     it(`GET user's addresses ::: /user/{userId}/addresses`, async () => {
//       try {
//         const expected = data.getResAddresses;
//         const response = await chai
//           .request(SERVER_URL)
//           .get(`/${userId}/addresses`);

//         expect(response.status).to.be.equal(200);
//         expect(response.body).to.deep.equalInAnyOrder(expected);
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });

//     it(`UPDATE user's address as preferred ::: /user/{userId}/addresses/`, async () => {
//       try {
//         const addresses = data.getResAddresses;
//         const req = data.putReqPrefAddress;
//         const response = await chai
//           .request(SERVER_URL)
//           .put(`/${userId}/addresses/1`)
//           .send(req)
//           .set('Content-Type', 'application/json');

//         expect(response.status).to.be.equal(200);
//         //expect(response.body.result.addresses.preferred)
//       } catch (err) {
//         console.log('error ::: ', err);
//         expect.fail();
//       }
//     });
//   });

//   after(async () => {
//     //
//   });
// });
