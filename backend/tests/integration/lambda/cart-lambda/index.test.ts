// import {
//   getCartItems,
//   addCartItem,
//   updateCartItems,
//   deleteCartItem,
// } from '@/lambdas/cart-lambda/controller';
// import * as data from 'tests/events/event-sign-in.json';
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import chaiAsPromised from 'chai-as-promised';
// import { expect } from 'chai';
// import fs from 'fs-extra';
// import * as sinon from 'sinon';
// import { SQLConnectionManager } from '/opt/sql-layer';
// chai.use(chaiAsPromised);
// chai.use(chaiHttp);

// describe('Integration tests for Cart', function () {
//   let stub;
//   const SERVER_URL =
//     'https://ih957avo41.execute-api.us-west-2.amazonaws.com/prod';
//   // const SERVER_URL = 'https://localhost:8080';

//   before(() => {
//     stub = sinon.stub(SQLConnectionManager, 'createConnectionPool');
//   });

//   it('GET test for getCartItemsL', async () => {
//     try {
//       return chai
//         .request(SERVER_URL)
//         .get('/carts/2/items')
//         .then((res: ChaiHttp.Response) => {
//           console.log('res body ::: ', res.body);
//           expect(res.status).to.be.equal(200);
//           expect(res.body.cart).to.have.deep.members([
//             {
//               products: [
//                 {
//                   id: 1,
//                   name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
//                   price: 5.869999885559082,
//                   quantity: 1,
//                   product_uri:
//                     'https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg',
//                 },
//                 {
//                   id: 2,
//                   name: 'Command Medium Picture Hanging Strips Value Pack, 12 Pairs, White - 17204-EF',
//                   price: 11.770000457763672,
//                   quantity: 2,
//                   product_uri:
//                     'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
//                 },
//               ],
//             },
//           ]);
//         });
//     } catch (err) {
//       console.log(err);
//       expect.fail();
//     }
//   });

//   it('PUT test for updateCartItemsL', async () => {
//     const items: Buffer | undefined = fs.readFileSync(
//       './tests/events/carts-lambda/update-cart-valid2.json'
//     );
//     try {
//       return chai
//         .request(SERVER_URL)
//         .put('/carts/4/items')
//         .send(items)
//         .set('Content-Type', 'application/x-zip-compressed')
//         .then((res: ChaiHttp.Response) => {
//           console.log('res body ::: ', res.body.cart_items);
//           expect(res.status).to.be.equal(200);
//           expect(res.body.cart_items).to.have.deep.members([
//             {
//               id: 4,
//               quantity: 2,
//             },
//             {
//               id: 5,
//               quantity: 1,
//             },
//           ]);
//         });
//     } catch (err) {
//       console.log('error :: ', err);
//       expect.fail();
//     }
//   });

//   after(() => {
//     stub.restore();
//   });
// });
