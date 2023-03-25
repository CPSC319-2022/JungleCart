export const getResUser = {
  user: [
    {
      id: 1,
      is_admin: 1,
      first_name: 'test',
      last_name: 'test',
      email: 'test@gmail.com',
      department_id: 1,
      created_at: '2023-03-16T00:00:00.000Z',
    },
  ],
};
export const getResBuyer = {
  buyer: {
    orders: [
      {
        id: 1,
        status: 'ordered',
        products: [
          {
            id: 1,
            img: 'https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg',
            name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
            price: 5.87,
            status: 'in stock',
            description:
              'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
          },
          {
            id: 4,
            img: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
            name: 'Gorilla Fabric Glue, 100% Waterproof, No Sew Solution, Washer/Dryer Safe, Permanent Bond, 2.5fl oz/73ml, Clear, (1-Pack), 8215402',
            price: 9.97,
            status: 'in stock',
            description:
              'Gorilla Fabric Glue is a 100% waterproof, no sew solution for hems, embellishments, trim and more! Formulated to bond fabric, and hard-to-hold embellishments, Gorilla Fabric Glue provides a fast setting, permanent bond that remains flexible after washing.',
          },
        ],
        created_at: '2015-12-17',
      },
    ],
    address: {
      city: 'vancouver',
      line1: 'test5 address_1',
      line2: 'test6 address_2',
      province: 'bc',
      postalcode: 'V6S 0G8',
    },
  },
};
export const getResSeller = {
  seller: {
    products: [
      {
        id: 1,
        img: 'https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg',
        name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
        price: 5.87,
        status: 'in stock',
        description:
          'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
      },
      {
        id: 2,
        img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
        name: 'Command Medium Picture Hanging Strips Value Pack, 12 Pairs, White - 17204-EF',
        price: 11.77,
        status: 'in stock',
        description:
          'Command picture hanging strips make decorating quick and easy. One click tells you Command picture hanging strips are locked in and holding tight. Best of all, when you are ready to take down or move your pictures, they come off leaving no wall damage, cracked plaster or sticky residue. Command picture hanging strips come in three sizes: small strips hold most 8 in x 10 in (20.32 cm x 25.4 cm) frames, medium strips hold most 18 in x 24 in (45.7 cm x 60.96 cm) frames and large strips hold most 24 in x 36 in (60.96 cm x 91.44 cm) frames. Also available are Command frame stabilizer strips which keep picture frames level even if hung by nails.',
      },
      {
        id: 3,
        img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
        name: "Elmer's 60509q Extra Strength Office Glue Stick, 8g (0.28 Oz.) Each, 3-pack",
        price: 3.88,
        status: 'in stock',
        description:
          "Elmer's Products, Inc. is a company rich in history and tradition. Since the 1940's the Elmer's family of products has developed to meet the ever-changing needs of consumers. They range from a full line of adhesives, arts, crafts, and educational products for children to a complete offering of craft, hobby, office, and home repair products for adults.",
      },
      {
        id: 4,
        img: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
        name: 'Gorilla Fabric Glue, 100% Waterproof, No Sew Solution, Washer/Dryer Safe, Permanent Bond, 2.5fl oz/73ml, Clear, (1-Pack), 8215402',
        price: 9.97,
        status: 'in stock',
        description:
          'Gorilla Fabric Glue is a 100% waterproof, no sew solution for hems, embellishments, trim and more! Formulated to bond fabric, and hard-to-hold embellishments, Gorilla Fabric Glue provides a fast setting, permanent bond that remains flexible after washing.',
      },
      {
        id: 6,
        img: 'https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg',
        name: 'Harry Potter Series 1',
        price: 25.55,
        status: 'in stock',
        description:
          "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts",
      },
      {
        id: 11,
        img: null,
        name: 'Headphones - Bose QuietComfort 35 II',
        price: 329.99,
        status: 'in stock',
        description:
          'The Bose QuietComfort 35 II headphones offer world-class noise cancellation and premium sound quality, with up to 20 hours of battery life.',
      },
    ],
  },
};

export const getResAddresses = {
  addresses: {
    preferred_address: {
      id: 1,
      city: 'vancouver',
      province: 'bc',
      recipient: 'test',
      telephone: '111-222-3333',
      address_line_1: 'test5 address_1',
      address_line_2: 'test6 address_2',
    },
    other_address: [
      {
        id: 0,
        city: 'preferred city',
        province: 'preferred province',
        recipient: 'user1',
        telephone: '111-222-3333',
        address_line_1: 'preferred line1',
        address_line_2: 'preferred line2',
      },
    ],
  },
};

export const getResAddress = {
  address: [
    {
      id: 1,
      user_id: 1,
      address_line_1: 'test5 address_1',
      address_line_2: 'test6 address_2',
      city: 'vancouver',
      province: 'bc',
      postal_code: 'V6S 0G8',
      recipient: 'test',
      telephone: '111-222-3333',
    },
  ],
};

export const getResPayment = {
  payment: {
    is_paypal: 0,
    paypal_id: null,
    is_credit: 1,
    bank_name: 'RBC',
    card_num: '9876543210233321',
    expiration_date: '2026/05/06',
    first_name: 'Anna',
    last_name: 'Jones',
  },
};

export const postResPreferredAddress = {
  message: 'created address.',
  address: {
    address_line_1: 'preferred line1',
    address_line_2: '#preferred',
    city: 'vancouver',
    province: 'bc',
    postal_code: 'V6S 0G8',
    recipient: 'user1',
    telephone: '111-222-3333',
    preferred: true,
  },
};

export const postReqPreferredAddress = {
  address: {
    preferred: true,
    address_line_1: 'preferred line1',
    address_line_2: '#preferred',
    city: 'preferred city',
    province: 'preferred province',
    postal_code: 'V6S 0G8',
    recipient: 'user1',
    telephone: '111-222-3333',
  },
};

export const postReqNonPreferredAddress = {
  address: {
    preferred: false,
    address_line_1: 'non preferred line1',
    address_line_2: '#non-preferred',
    city: 'preferred city',
    province: 'preferred province',
    postal_code: 'V6S 0G8',
    recipient: 'user1',
    telephone: '111-222-3333',
  },
};

export const putReqPreferredAddress = {
  address: {
    preferred: true,
    address_line_1: 'preferred address_1',
    address_line_2: '#preferred',
    city: 'vancouver',
    province: 'bc',
    postal_code: 'V6S 0G8',
    recipient: 'test',
    telephone: '111-222-3333',
  },
};

export const putReqNonPreferredAddress = {
  address: {
    preferred: false,
    address_line_1: 'non preferred address_1',
    address_line_2: '#non-pereferred',
    city: 'vancouver',
    province: 'bc',
    postal_code: 'V6S 0G8',
    recipient: 'test',
    telephone: '111-222-3333',
  },
};

export const postReqPayment = {
  payment: {
    is_paypal: 0,
    paypal_id: null,
    is_credit: 1,
    bank_name: 'RBC',
    card_num: '9876543210233321',
    expiration_date: '2026/05/06',
    first_name: 'Anna',
    last_name: 'Jones',
  },
};

export const putReqPrefAddress = {
  address: {
    preferred: true,
    address_line_1: 'test5 address_1',
    address_line_2: 'test6 address_2',
    city: 'vancouver',
    province: 'bc',
    postal_code: 'V6S 0G8',
    recipient: 'test',
    telephone: '111-222-3333',
  },
};

export const putReqNonPrefAddress = {
  address: {
    preferred: false,
    address_line_1: 'test5 address_1',
    address_line_2: 'test6 address_2',
    city: 'vancouver',
    province: 'bc',
    postal_code: 'V6S 0G8',
    recipient: 'test',
    telephone: '111-222-3333',
  },
};

export const putReqPayment = {
  payment: {
    is_paypal: 0,
    paypal_id: null,
    is_credit: 1,
    bank_name: 'RBC',
    card_num: '9876543210233321',
    expiration_date: '2026/05/06',
    first_name: 'Anna',
    last_name: 'Jones',
  },
};
