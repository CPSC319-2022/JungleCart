import { db } from '../src/utils/db.server'
import * as types from '../src/utils/types'

async function seed() {
  await Promise.all(
    getUsers().map((user) => {
      return db.user.create({
        data: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          department: user.department,
          // created_at: user.created_at,
        },
      })
    })
  )
}

seed()

function getUsers(): Array<types.User> {
  return [
    {
      id: 1,
      first_name: 'test1',
      last_name: 'test1',
      email: 'test1@gmail.com',
      department: 'HR',
      // created_at: '2023/02/01',
    },
    {
      id: 2,
      first_name: 'test2',
      last_name: 'test2',
      email: 'test2@gmail.com',
      department: 'TECH',
      // created_at: '2023/02/11',
    },
    {
      id: 3,
      first_name: 'test3',
      last_name: 'test3',
      email: 'test3@gmail.com',
      department: 'Operation',
      // created_at: '2023/02/1',
    },
    {
      id: 4,
      first_name: 'test4',
      last_name: 'test4',
      email: 'test1@gmail.com',
      department: 'HR',
      // created_at: '2023/02/01',
    },
    {
      id: 5,
      first_name: 'test5',
      last_name: 'test5',
      email: 'test2@gmail.com',
      department: 'TECH',
      // created_at: '2023/02/11',
    },
    {
      id: 6,
      first_name: 'test6',
      last_name: 'test6',
      email: 'test3@gmail.com',
      department: 'Operation',
      // created_at: '2023/02/1',
    },
    {
      id: 7,
      first_name: 'test7',
      last_name: 'test7',
      email: 'test1@gmail.com',
      department: 'HR',
      // created_at: '2023/02/01',
    },
    {
      id: 8,
      first_name: 'test8',
      last_name: 'test8',
      email: 'test2@gmail.com',
      department: 'TECH',
      // created_at: '2023/02/11',
    },
    {
      id: 9,
      first_name: 'test9',
      last_name: 'test9',
      email: 'test3@gmail.com',
      department: 'Operation',
      // created_at: '2023/02/1',
    },
  ]
}

// function getBuyers(): Array<types.Buyer> {
//   return [
//     {
//       id: 1,
//       pref_address_id: 1,
//       pref_pm_id: 1,
//     },
//     {
//       id: 2,
//       pref_address_id: 2,
//       pref_pm_id: 2,
//     },
//     {
//       id: 3,
//       pref_address_id: 3,
//       pref_pm_id: 3,
//     },
//   ]
// }

// function getSellers(): Array<types.Seller> {
//   return [
//     {
//       id: 1,
//       bank_name: 'TD',
//       account_num: '1234567890',
//     },
//     {
//       id: 2,
//       bank_name: 'CIBC',
//       account_num: '22334455667',
//     },
//     {
//       id: 3,
//       bank_name: 'RBC',
//       account_num: '198302134',
//     },
//     {
//       id: 4,
//       bank_name: 'TD',
//       account_num: '1230984556',
//     },
//   ]
// }

// function getAddresses(): Array<types.Address> {
//   return [
//     {
//       id: 1,
//       user_id: 1,
//       address_line_1: '1st Street',
//       address_line_2: '#123',
//       city: 'Vancouver',
//       province: 'BC',
//       postal_code: 'V1A 2B3',
//       recipient: 'Yoon',
//       telephone: '778-441-2311',
//     },
//     {
//       id: 2,
//       user_id: 2,
//       address_line_1: '2nd Street',
//       address_line_2: '',
//       city: 'North Vancouver',
//       province: 'BC',
//       postal_code: 'V2B 3C4',
//       recipient: 'John',
//       telephone: '778-441-2311',
//     },
//     {
//       id: 3,
//       user_id: 3,
//       address_line_1: '3rd Street',
//       address_line_2: '#321',
//       city: 'Burnaby',
//       province: 'BC',
//       postal_code: 'V3C 4D5',
//       recipient: 'James',
//       telephone: '778-441-2311',
//     },
//     {
//       id: 4,
//       user_id: 4,
//       address_line_1: '4th Avenue',
//       address_line_2: '#210',
//       city: 'Vancouver',
//       province: 'BC',
//       postal_code: 'V6E 1V1',
//       recipient: 'Sara',
//       telephone: '778-441-2311',
//     },
//     {
//       id: 5,
//       user_id: 5,
//       address_line_1: '5th Street',
//       address_line_2: '#1024',
//       city: 'Richmond',
//       province: 'BC',
//       postal_code: 'V6G 2K3',
//       recipient: 'Jin',
//       telephone: '778-441-2311',
//     },
//     {
//       id: 6,
//       user_id: 6,
//       address_line_1: 'Larch Street',
//       address_line_2: '#336',
//       city: 'Richmond',
//       province: 'BC',
//       postal_code: 'V5X 3T7',
//       recipient: 'Smith',
//       telephone: '778-441-2311',
//     },
//     {
//       id: 7,
//       user_id: 7,
//       address_line_1: '5th Street',
//       address_line_2: '#1125',
//       city: 'Richmond',
//       province: 'BC',
//       postal_code: 'V6G 2K3',
//       recipient: 'Alex',
//       telephone: '778-441-2311',
//     },
//   ]
// }

// function getPaymentMethod(): Array<types.Payment_method> {
//   return [
//     {
//       id: 1,
//       is_paypal: true,
//       paypal_id: 'john.smith@gmail.com',
//       is_credit: false,
//       bank_name: 'TD',
//       card_num: '4567891234567890',
//       expiration_date: '2023_01_01',
//       first_name: 'John',
//       last_name: 'Smith',
//     },
//     {
//       id: 2,
//       is_paypal: false,
//       paypal_id: null,
//       is_credit: true,
//       bank_name: 'RBC',
//       card_num: '9876543210233321',
//       expiration_date: '2026_05_06',
//       first_name: 'Anna',
//       last_name: 'Jones',
//     },
//     {
//       id: 3,
//       is_paypal: true,
//       paypal_id: 'karen.williams@outlook.com',
//       is_credit: false,
//       bank_name: 'MBO',
//       card_num: '1230987654324456',
//       expiration_date: '2024_06_01',
//       first_name: 'Karen',
//       last_name: 'Williams',
//     },
//     {
//       id: 4,
//       is_paypal: false,
//       paypal_id: null,
//       is_credit: true,
//       bank_name: 'CIBC',
//       card_num: '6543210987654321',
//       expiration_date: '2024_06_22',
//       first_name: 'Jason',
//       last_name: 'Davis',
//     },
//     {
//       id: 5,
//       is_paypal: false,
//       paypal_id: null,
//       is_credit: true,
//       bank_name: 'TD',
//       card_num: '3210987654321098',
//       expiration_date: '2026_11_11',
//       first_name: 'Sarah',
//       last_name: 'Taylor',
//     },
//     {
//       id: 6,
//       is_paypal: true,
//       paypal_id: 'akira@gmail.com',
//       is_credit: false,
//       bank_name: 'NBC',
//       card_num: '2109876543210987',
//       expiration_date: '2024_12_12',
//       first_name: 'Yoshi',
//       last_name: 'Yamamoto',
//     },
//     {
//       id: 7,
//       is_paypal: true,
//       paypal_id: 'Davis055@gmail.com',
//       is_credit: false,
//       bank_name: 'HSBC',
//       card_num: '7894561234567890',
//       expiration_date: '2023_03_08',
//       first_name: 'Matthew',
//       last_name: 'Davis',
//     },
//     {
//       id: 8,
//       is_paypal: true,
//       paypal_id: 'YZ@gmail.com',
//       is_credit: false,
//       bank_name: 'RBC',
//       card_num: '4567890123456789',
//       expiration_date: '2023_05_01',
//       first_name: 'Yun',
//       last_name: 'Zhang',
//     },
//     {
//       id: 42,
//       is_paypal: true,
//       paypal_id: 'emily.johnson@outlook.com',
//       is_credit: false,
//       bank_name: 'CIBC',
//       card_num: '1023456789012345',
//       expiration_date: '2023_05_15',
//       first_name: 'Emily',
//       last_name: 'Johnson',
//     },
//     {
//       id: 10,
//       is_paypal: false,
//       paypal_id: null,
//       is_credit: false,
//       bank_name: 'CIBC',
//       card_num: '8761234567890123',
//       expiration_date: '2023_08_13',
//       first_name: 'Eileen',
//       last_name: 'Brown',
//     },
//   ]
// }

// function getAdmin(): Array<types.Admin> {
//   return [
//     {
//       id: 1,
//       email: 'admin1@gmail.com',
//       first_name: 'admin1',
//       last_name: 'admin',
//       department: 'HR',
//       role: 'superUser',
//     },
//     {
//       id: 2,
//       email: 'admin2@gmail.com',
//       first_name: 'admin2',
//       last_name: 'admin',
//       department: 'opration',
//       role: 'subManager',
//     },
//   ]
// }

// function getProduct(): Array<types.Product> {
//   return [
//     {
//       id: 1,
//       seller_id: 1,
//       name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
//       price: 5.87,
//       discount: 37,
//       description:
//         'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
//       total_quantity: 10,
//       status: 'instock',
//       shipping_method: 'canada post',
//       address: 'Vancouver, BC, V6S 0G8, CA',
//       category_id: 1,
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//     {
//       id: 2,
//       seller_id: 1,
//       name: 'Command Medium Picture Hanging Strips Value Pack, 12 Pairs, White - 17204-EF',
//       price: 11.77,
//       discount: 0,
//       description:
//         'Command picture hanging strips make decorating quick and easy. One click tells you Command picture hanging strips are locked in and holding tight. Best of all, when you are ready to take down or move your pictures, they come off leaving no wall damage, cracked plaster or sticky residue. Command picture hanging strips come in three sizes: small strips hold most 8 in x 10 in (20.32 cm x 25.4 cm) frames, medium strips hold most 18 in x 24 in (45.7 cm x 60.96 cm) frames and large strips hold most 24 in x 36 in (60.96 cm x 91.44 cm) frames. Also available are Command frame stabilizer strips which keep picture frames level even if hung by nails.',
//       total_quantity: 100,
//       status: 'instock',
//       shipping_method: 'canada post',
//       address: 'Vancouver, BC, V6S 0G8, CA',
//       category_id: 1,
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//     {
//       id: 3,
//       seller_id: 1,
//       name: "Elmer's 60509q Extra Strength Office Glue Stick, 8g (0.28 Oz.) Each, 3-pack",
//       price: 3.88,
//       discount: 0,
//       description:
//         "Elmer's Products, Inc. is a company rich in history and tradition. Since the 1940's the Elmer's family of products has developed to meet the ever-changing needs of consumers. They range from a full line of adhesives, arts, crafts, and educational products for children to a complete offering of craft, hobby, office, and home repair products for adults.",
//       total_quantity: 70,
//       status: 'instock',
//       address: 'Vancouver, BC, V6S 0G8, CA',
//       category_id: 1,
//       shipping_method: 'pick up',
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//     {
//       id: 4,
//       seller_id: 1,
//       name: 'Gorilla Fabric Glue, 100% Waterproof, No Sew Solution, Washer/Dryer Safe, Permanent Bond, 2.5fl oz/73ml, Clear, (1-Pack), 8215402',
//       price: 9.97,
//       discount: 0,
//       description:
//         'Gorilla Fabric Glue is a 100% waterproof, no sew solution for hems, embellishments, trim and more! Formulated to bond fabric, and hard-to-hold embellishments, Gorilla Fabric Glue provides a fast setting, permanent bond that remains flexible after washing.',
//       total_quantity: 70,
//       status: 'instock',
//       address: 'Vancouver, BC, V6S 0G8, CA',
//       category_id: 1,
//       shipping_method: 'canada post',
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//     {
//       id: 5,
//       seller_id: 2,
//       name: 'Bissell Little Green Proheat Portable Deep Cleaner/Spot Cleaner with self-Cleaning HydroRinse Tool for Carpet and Upholstery 2513B',
//       price: 149.97,
//       discount: 0,
//       description:
//         "No need to pull out a full-size carpet cleaning Machine every time a stain or spot appear on your carpet. With Bissell little green ProHeat, you can remove tough spots and stains when used with Bissell spot & stain + Oxy. It's a powerful compact cleaning Machine. Built-in heatwave technology maintains consistent water temperature while cleaning for heated cleaning.",
//       total_quantity: 40,
//       shipping_method: 'canada post',
//       status: 'instock',
//       address: 'Vancouver, BC, V6S 0G8, CA',
//       category_id: 1,
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//     {
//       id: 6,
//       seller_id: 1,
//       name: 'Harry Potter Series 1',
//       price: 25.55,
//       description:
//         "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts",
//       status: 'in stock',
//       discount: 10.5,
//       total_quantity: 1,
//       address: 'Fremont, California 94536,US',
//       category_id: 2,
//       shipping_method: 'pick up',
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//     {
//       id: 7,
//       seller_id: 2,
//       name: 'Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal',
//       price: 34.5,
//       discount: 5.99,
//       description:
//         'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.Improved speaker quality - Better speaker quality than Echo Dot Gen 2 for richer and louder sound. Pair with a second Echo Dot for stereo sound.',
//       total_quantity: 1,
//       status: 'in stock',
//       address: 'Seattle, WA 98109, USA',
//       shipping_method: 'canada post',
//       category_id: 2,
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//     {
//       id: 8,
//       seller_id: 3,
//       name: 'Kindle Paperwhite (8 GB) – Now with a 6.8 display and adjustable warm light',
//       price: 119.99,
//       discount: 10,
//       description:
//         'Kindle Paperwhite – Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
//       total_quantity: 1,
//       status: 'low in stock',
//       address: 'Seattle, WA 98109, USA',
//       shipping_method: 'canada post',
//       category_id: 2,
//       created_at: '2022/02/10',
//       updated_at: '2022/02/10',
//     },
//   ]
// }

// function getShippingConstraint(): Array<types.Shipping_constraint> {
//   return [
//     {
//       product_id: 1,
//       region: 'BC',
//       distance: 14.3,
//     },
//     {
//       product_id: 2,
//       region: 'BC',
//       distance: 10.0,
//     },
//     {
//       product_id: 3,
//       region: 'BC',
//       distance: 10.0,
//     },
//     {
//       product_id: 4,
//       region: 'BC',
//       distance: 10.0,
//     },
//     {
//       product_id: 5,
//       region: 'BC',
//       distance: 20.0,
//     },
//     {
//       product_id: 6,
//       region: 'BC',
//       distance: null,
//     },
//     {
//       product_id: 7,
//       region: 'BC',
//       distance: 10,
//     },
//     {
//       product_id: 8,
//       region: 'Canada',
//       distance: 10,
//     },
//   ]
// }

// function getCategory(): Array<types.Category> {
//   return [
//     {
//       id: 1,
//       name: 'Home and Kitchen',
//     },
//     {
//       id: 2,
//       name: 'Electronics',
//     },
//   ]
// }

// function getProductMultimedia(): Array<types.Product_multimedia> {
//   return [
//     {
//       id: 1,
//       url: 'https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg',
//       product_id: 1,
//     },
//     {
//       id: 2,
//       url: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
//       product_id: 2,
//     },
//     {
//       id: 3,
//       url: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
//       product_id: 3,
//     },
//     {
//       id: 4,
//       url: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
//       product_id: 4,
//     },
//     {
//       id: 5,
//       url: 'https://m.media-amazon.com/images/I/91zBUhFKfWL._AC_SL1500_.jpg',
//       product_id: 5,
//     },
//     {
//       id: 6,
//       url: 'https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg',
//       product_id: 6,
//     },
//     {
//       id: 7,
//       url: 'https://m.media-amazon.com/images/I/61PHZfkhxIL._AC_SL1000_.jpg',
//       product_id: 7,
//     },
//     {
//       id: 8,
//       url: 'https://m.media-amazon.com/images/G/15/kindle/dp/2019/rb26dett/s/S_Desktop_Pack_1_Image_v1._CB441119230_.jpg',
//       product_id: 7,
//     },
//   ]
// }

// function getOrders(): Array<types.Order> {
//   return [
//     {
//       id: 1,
//       buyer_id: 1,
//       status: 'completed',
//       date: '2023/02/10',
//     },
//     {
//       id: 2,
//       buyer_id: 2,
//       status: 'completed',
//       date: '2023/02/11',
//     },
//     {
//       id: 3,
//       buyer_id: 3,
//       status: 'ordered',
//       date: '2023/02/14',
//     },
//     {
//       id: 4,
//       buyer_id: 5,
//       status: 'completed',
//       date: '2023/02/01',
//     },
//     {
//       id: 5,
//       buyer_id: 5,
//       status: 'shipped',
//       date: '2023/02/08',
//     },
//   ]
// }
// function getOrderItems(): Array<types.Order_item> {
//   return [
//     {
//       order_id: 1,
//       product_id: 1,
//       shippings: 1,
//       quantity: 2,
//     },
//     {
//       order_id: 2,
//       product_id: 2,
//       shippings: 2,
//       quantity: 1,
//     },
//     {
//       order_id: 3,
//       product_id: 3,
//       shippings: 3,
//       quantity: 5,
//     },
//     {
//       order_id: 4,
//       product_id: 4,
//       shippings: 4,
//       quantity: 4,
//     },
//     {
//       order_id: 5,
//       product_id: 5,
//       shippings: 5,
//       quantity: 2,
//     },
//   ]
// }
// function getShippingStatus(): Array<types.Shipping_status> {
//   return [
//     {
//       id: 1,
//       status: 'shipped',
//       expected_delivery_date: '2022/02/15',
//     },
//     {
//       id: 2,
//       status: 'delivered',
//       expected_delivery_date: '2022/02/13',
//     },
//     {
//       id: 3,
//       status: 'shipped',
//       expected_delivery_date: '2022/02/16',
//     },
//     {
//       id: 4,
//       status: 'shipped',
//       expected_delivery_date: '2022/02/18',
//     },
//     {
//       id: 5,
//       status: 'delivered',
//       expected_delivery_date: '2022/02/12',
//     },
//   ]
// }

// function getCartItems(): Array<types.Cart_item> {
//   return [
//     {
//       buyer_id: 1,
//       product_id: 1,
//       quantity: 1,
//     },
//     {
//       buyer_id: 2,
//       product_id: 2,
//       quantity: 2,
//     },
//     {
//       buyer_id: 3,
//       product_id: 3,
//       quantity: 3,
//     },
//     {
//       buyer_id: 4,
//       product_id: 4,
//       quantity: 1,
//     },
//     {
//       buyer_id: 5,
//       product_id: 5,
//       quantity: 1,
//     },
//   ]
// }
