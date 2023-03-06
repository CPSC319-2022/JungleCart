// be/src/database/mock/data.ts

export const user = {
  admin: [
    {
      id: 1,
      first_name: 'admin1',
      last_name: 'admin',
      email: 'admin1@gmail.com',
    },
    {
      id: 2,
      first_name: 'admin2',
      last_name: 'admin',
      email: 'admin2@gmail.com',
    },
  ],
  users: [
    {
      id: 1,
      first_name: 'Billy',
      last_name: 'Bob',
      email: 'billybob@gmail.com',
    },
    {
      id: 2,
      first_name: 'James',
      last_name: 'Johnson',
      email: 'jamesjohnson@gmail.com',
    },
    {
      id: 3,
      first_name: 'David',
      last_name: 'Dirk',
      email: 'daviddirk@gmail.com',
    },
  ],
}

export const buyer = [
  {
    address: '5959 Students Union Blvd, Vancouver, BC, V6T 1K2',
    orders: [
      {
        id: 5,
        status: 'delievered',
        products: [
          {
            id: 1,
            product_uri: '/products/1',
            name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
            price: 5.87,
            description:
              'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
            img: [
              'https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg',
            ],
            quantity: 1,
            shipping_status: 'delivered',
          },
          {
            id: 2,
            product_uri: '/products/2',
            name: 'Command Medium Picture Hanging Strips Value Pack, 12 Pairs, White - 17204-EF',
            price: 11.77,
            description:
              'Command picture hanging strips make decorating quick and easy. One click tells you Command picture hanging strips are locked in and holding tight. Best of all, when you are ready to take down or move your pictures, they come off leaving no wall damage, cracked plaster or sticky residue. Command picture hanging strips come in three sizes: small strips hold most 8 in x 10 in (20.32 cm x 25.4 cm) frames, medium strips hold most 18 in x 24 in (45.7 cm x 60.96 cm) frames and large strips hold most 24 in x 36 in (60.96 cm x 91.44 cm) frames. Also available are Command frame stabilizer strips which keep picture frames level even if hung by nails.',
            img: [
              'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
            ],
            quantity: 1,
            shipping_status: 'delivered',
          },
        ],
        created_at: '2022-02-18',
      },
      {
        id: 6,
        status: 'shipped',
        products: [
          {
            id: 3,
            product_uri: '/products/3',
            name: "Elmer's 60509q Extra Strength Office Glue Stick, 8g (0.28 Oz.) Each, 3-pack",
            price: 3.88,
            description:
              "Elmer's Products, Inc. is a company rich in history and tradition. Since the 1940's the Elmer's family of products has developed to meet the ever-changing needs of consumers. They range from a full line of adhesives, arts, crafts, and educational products for children to a complete offering of craft, hobby, office, and home repair products for adults.",
            img: [
              'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
            ],
            quantity: 1,
            shipping_status: 'shipped',
          },
          {
            id: 4,
            product_uri: '/products/4',
            name: 'Gorilla Fabric Glue, 100% Waterproof, No Sew Solution, Washer/Dryer Safe, Permanent Bond, 2.5fl oz/73ml, Clear, (1-Pack), 8215402',
            price: 9.97,
            description:
              'Gorilla Fabric Glue is a 100% waterproof, no sew solution for hems, embellishments, trim and more! Formulated to bond fabric, and hard-to-hold embellishments, Gorilla Fabric Glue provides a fast setting, permanent bond that remains flexible after washing.',
            img: [
              'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
            ],
            quantity: 1,
            shipping_status: 'shipped',
          },
        ],
        created_at: '2022-02-11',
      },
    ],
  },
]

export const seller = [
  // this is for summary page for seller. more detailed info for each product will be provided in each product page
  {
    products: [
      {
        product_uri: '/products/1',
        id: 1,
        name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
        price: 5.87,
        discount: 37,
        description:
          'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
        status: 'instock',
        address: 'Vancouver, BC, V6S 0G8, CA',
        img: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
        category_id: 1,
        total_quantity: 10,
        sold: 1,
      },
      {
        product_uri: '/products/2',
        id: 2,
        name: 'Command Medium Picture Hanging Strips Value Pack, 12 Pairs, White - 17204-EF',
        price: 11.77,
        discount: 0, // %
        description:
          'Command picture hanging strips make decorating quick and easy. One click tells you Command picture hanging strips are locked in and holding tight. Best of all, when you are ready to take down or move your pictures, they come off leaving no wall damage, cracked plaster or sticky residue. Command picture hanging strips come in three sizes: small strips hold most 8 in x 10 in (20.32 cm x 25.4 cm) frames, medium strips hold most 18 in x 24 in (45.7 cm x 60.96 cm) frames and large strips hold most 24 in x 36 in (60.96 cm x 91.44 cm) frames. Also available are Command frame stabilizer strips which keep picture frames level even if hung by nails.',
        status: 'instock', // preset (outstock, instock)
        address: 'Vancouver, BC, V6S 0G8, CA',
        category_id: 1,
        img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
        total_quantity: 100,
        sold: 5,
      },
      {
        product_uri: '/products/3',
        id: 3,
        name: "Elmer's 60509q Extra Strength Office Glue Stick, 8g (0.28 Oz.) Each, 3-pack",
        price: 3.88,
        discount: 0, // %
        description:
          "Elmer's Products, Inc. is a company rich in history and tradition. Since the 1940's the Elmer's family of products has developed to meet the ever-changing needs of consumers. They range from a full line of adhesives, arts, crafts, and educational products for children to a complete offering of craft, hobby, office, and home repair products for adults.",
        status: 'instock', // preset (outstock, instock)
        address: 'Vancouver, BC, V6S 0G8, CA',
        category_id: 1,
        img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
        total_quantity: 70,
        sold: 1,
      },
      {
        product_uri: '/products/4',
        id: 4,
        name: 'Gorilla Fabric Glue, 100% Waterproof, No Sew Solution, Washer/Dryer Safe, Permanent Bond, 2.5fl oz/73ml, Clear, (1-Pack), 8215402',
        price: 9.97,
        discount: 0, // %
        description:
          'Gorilla Fabric Glue is a 100% waterproof, no sew solution for hems, embellishments, trim and more! Formulated to bond fabric, and hard-to-hold embellishments, Gorilla Fabric Glue provides a fast setting, permanent bond that remains flexible after washing.',
        status: 'instock', // preset (outstock, instock)
        address: 'Vancouver, BC, V6S 0G8, CA',
        category_id: 1,
        img: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
        total_quantity: 70,
        sold: 1,
      },
    ],
  },
]

export const orders = [
  {
    id: 1,
    status: 'in progress',
    products: [
      {
        id: 6,
        product_uri: 'products/6',
        name: 'Harry Potter Series 1',
        price: 25.55,
        description:
          "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts",
        img: 'https://www.amazon.ca/Harry-Potter-Philosophers-Stone-Rowling/dp/1408855895?asin=1408855895&revisionId=&format=4&depth=1',
        quantity: 1,
        shipping_status: 'shipped',
      },
      {
        id: 7,
        product_uri: 'products/7',
        name: 'Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal',
        price: 34.5,
        description:
          'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.Improved speaker quality - Better speaker quality than Echo Dot Gen 2 for richer and louder sound. Pair with a second Echo Dot for stereo sound.',
        img: 'https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg',
        quantity: 2,
        shipping_status: 'prepared',
      },
    ],
    created_at: '2023/02/10',
  },
  {
    id: 2,
    status: 'ordered',
    products: [
      {
        id: 9,
        product_uri: 'products/9',
        name: 'Simple Modern Insulated Thermos Travel Coffee Mug with Snap Flip Lid',
        price: 19.99,
        description:
          'The Kona is a stainless steel thermos that’s ideal for hot drinks like coffee and tea, with a wide opening that makes refills easyThe BPA-free twist-on lid has a lockable, push-button cover that snaps closed to prevent leaks and spills and locks the lid back when open for easy drinking; Patent Pending',
        img: 'https://m.media-amazon.com/images/I/61kfV3CAb0L._AC_SL1300_.jpg',
        quantity: '1',
        shipping_status: 'in progress',
      },
      {
        id: 10,
        product_uri: 'products/10',
        name: "DREAM PAIRS Women's Dress Shoes",
        price: 54.99,
        description:
          'Thermoplastic Elastomers soleSlip-on design: Elastic side goring design to fits the foot shape, easy-on-and-off low heels shoes with light PU sole ensure a secured walking',
        img: 'https://m.media-amazon.com/images/I/71aVGFCvqQL._AC_UY695_.jpg',
        quantity: 1,
        shipping_status: 'shipped',
      },
    ],
    created_at: '2023/02/11',
  },
  {
    id: 3,
    status: 'delivered',
    products: [
      {
        id: 8,
        product_uri: 'products/8',
        name: 'Kindle Paperwhite (8 GB) – Now with a 6.8 display and adjustable warm light',
        price: 119.99,
        description:
          'Kindle Paperwhite – Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
        img: 'https://m.media-amazon.com/images/I/61PHZfkhxIL._AC_SL1000_.jpg',
        quantity: 2,
        shipping_status: 'shipped',
      },
    ],
    created_at: '2023/02/08',
  },
  {
    id: 4,
    status: 'delivered',
    products: [
      {
        id: 11,
        product_uri: 'products/11',
        name: 'Vancle Bands Compatible with Fitbit Charge 4 / Charge 3 / Charge 3 SE Bands',
        price: 8.99,
        description:
          'Premium Material: Made of flexible elastomer, sweat resistant & water resistant. Feels lightweight and soft, brings a comfortable wearing experience when you exercise, sleep etc.Buckle Design: Special design buckle are the same color as the fitbit charge 3 band, which is personalize to match your mood and outfit in daily life. Easy to install and resize, Double keep your band precisely and securely',
        img: 'https://m.media-amazon.com/images/I/61wRFlu38SL._AC_SL1500_.jpg',
        quantity: 1,
        shipping_status: 'delivered',
      },
      {
        id: 12,
        product_uri: 'products/12',
        name: 'MoKo Case for 6.8. Kindle Paperwhite (11th Generation-2021) and Kindle Paperwhite Signature Edition',
        price: 21.99,
        description:
          'Designed exclusively for 6.8 Amazon All-New Kindle Paperwhite and Kindle Paperwhite Signature Edition E-Reader (11th Generation - 2021/2022/2023 Release). Not fit other prior generation Kindle devices.Automatically wakes or puts your device to sleep when the lid is opened and closed.',
        img: 'https://m.media-amazon.com/images/I/71BBkBcrlfL._AC_SL1500_.jpg',
        quantity: 2,
        shipping_status: 'delivered',
      },
    ],
    created_at: '2023/02/01',
  },
]

export const product = [
  {
    id: 1,
    seller_id: 1,
    name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
    price: 5.87,
    discount: 37, // %
    description:
      'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
    total_quantity: 10,
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    shipping_constraint: [
      {
        region: 'BC',
        distance: 14.3, // float (km based)
      },
    ],
    img: 'https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg',
    category_id: 1,
  },
  {
    id: 2,
    seller_id: 1,
    name: 'Command Medium Picture Hanging Strips Value Pack, 12 Pairs, White - 17204-EF',
    price: 11.77,
    discount: 0, // %
    description:
      'Command picture hanging strips make decorating quick and easy. One click tells you Command picture hanging strips are locked in and holding tight. Best of all, when you are ready to take down or move your pictures, they come off leaving no wall damage, cracked plaster or sticky residue. Command picture hanging strips come in three sizes: small strips hold most 8 in x 10 in (20.32 cm x 25.4 cm) frames, medium strips hold most 18 in x 24 in (45.7 cm x 60.96 cm) frames and large strips hold most 24 in x 36 in (60.96 cm x 91.44 cm) frames. Also available are Command frame stabilizer strips which keep picture frames level even if hung by nails.',
    total_quantity: 100,
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    shipping_constraint: [
      {
        region: 'BC',
        distance: 10.0, // float (km based)
      },
    ],
    img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
    category_id: 1,
  },
  {
    id: 3,
    seller_id: 1,
    name: "Elmer's 60509q Extra Strength Office Glue Stick, 8g (0.28 Oz.) Each, 3-pack",
    price: 3.88,
    discount: 0, // %
    description:
      "Elmer's Products, Inc. is a company rich in history and tradition. Since the 1940's the Elmer's family of products has developed to meet the ever-changing needs of consumers. They range from a full line of adhesives, arts, crafts, and educational products for children to a complete offering of craft, hobby, office, and home repair products for adults.",
    total_quantity: 70,
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    shipping_constraint: [
      {
        region: 'BC',
        distance: 10.0, // float (km based)
      },
    ],
    img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
    category_id: 1,
  },
  {
    id: 4,
    seller_id: 1,
    name: 'Gorilla Fabric Glue, 100% Waterproof, No Sew Solution, Washer/Dryer Safe, Permanent Bond, 2.5fl oz/73ml, Clear, (1-Pack), 8215402',
    price: 9.97,
    discount: 0, // %
    description:
      'Gorilla Fabric Glue is a 100% waterproof, no sew solution for hems, embellishments, trim and more! Formulated to bond fabric, and hard-to-hold embellishments, Gorilla Fabric Glue provides a fast setting, permanent bond that remains flexible after washing.',
    total_quantity: 70,
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    shipping_constraint: {
      region: 'BC',
      distance: 10.0, // float (km based)
    },
    img: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
    category_id: 1,
  },
  {
    id: 5,
    seller_id: 2,
    name: 'Bissell Little Green Proheat Portable Deep Cleaner/Spot Cleaner with self-Cleaning HydroRinse Tool for Carpet and Upholstery 2513B',
    price: 149.97,
    discount: 0, // %
    description:
      "No need to pull out a full-size carpet cleaning Machine every time a stain or spot appear on your carpet. With Bissell little green ProHeat, you can remove tough spots and stains when used with Bissell spot & stain + Oxy. It's a powerful compact cleaning Machine. Built-in heatwave technology maintains consistent water temperature while cleaning for heated cleaning.",
    total_quantity: 40,
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    shipping_constraint: {
      region: 'BC',
      distance: 20.0, // float (km based)
    },
    img: 'https://m.media-amazon.com/images/I/91zBUhFKfWL._AC_SL1500_.jpg',
    category_id: 1,
  },
  {
    id: 6,
    seller_id: 1,
    name: 'Harry Potter Series 1',
    price: 25.55,
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts",
    status: 'in stock',
    discount: 10.5,
    total_quantity: 1,
    address: 'Fremont, California 94536,US',
    expected_delivery_date: '2023/02/16',
    shipping_constraint: {
      region: 'BC',
    },
    img: 'https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg',
    category_id: 2,
  },
  {
    id: 7,
    seller_id: 2,
    name: 'Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal',
    price: 34.5,
    discount: 5.99,
    description:
      'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.Improved speaker quality - Better speaker quality than Echo Dot Gen 2 for richer and louder sound. Pair with a second Echo Dot for stereo sound.',
    total_quantity: 1,
    status: 'in stock',
    address: 'Seattle, WA 98109, USA',
    expected_delivery_date: '2023/02/19',
    shipping_constraint: {
      region: 'BC',
      distance: 10,
    },
    img: 'https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg',
    category_id: 2,
  },
  {
    id: 8,
    seller_id: 3,
    name: 'Kindle Paperwhite (8 GB) – Now with a 6.8 display and adjustable warm light',
    price: 119.99,
    discount: 10,
    description:
      'Kindle Paperwhite – Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
    total_quantity: 1,
    status: 'low in stock',
    address: 'Seattle, WA 98109, USA',
    expected_delivery_date: '2023/02/11',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    img: 'https://m.media-amazon.com/images/I/61PHZfkhxIL._AC_SL1000_.jpg',
    category_id: 2,
  },
  {
    id: 9,
    seller_id: 101,
    name: 'Laptop - HP Pavilion',
    price: 899.99,
    promoting: true,
    description:
      'The HP Pavilion Laptop packs more performance into a smaller profile, so you can get more done wherever you go. Enjoy mind-blowing entertainment with a micro-edge screen and Audio by B&O.',
    address: '123 Main St., Anytown, USA',
    status: 'available',
    img: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07963197.png',
    created_at: '2022-02-01 10:00:00',
    updated_at: '2022-02-01 10:00:00',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    total_quantity: 50,
    category_id: 1,
  },
  {
    id: 10,
    seller_id: 102,
    name: 'Smartphone - Samsung Galaxy S22',
    price: 1099.99,
    promoting: false,
    description:
      'The Samsung Galaxy S22 is the ultimate smartphone, featuring a 6.4-inch Dynamic AMOLED 2X display, 5G connectivity, and a 64MP camera.',
    address: '456 Oak St., Anytown, USA',
    status: 'available',
    img: 'https://img.global.news.samsung.com/ca/wp-content/uploads/2022/02/Galaxy_S22_Ultra_PR_main1F.jpg',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-02 11:00:00',
    updated_at: '2022-02-03 10:00:00',
    total_quantity: 100,
    category_id: 2,
  },

  {
    id: 11,
    seller_id: 103,
    name: 'Headphones - Bose QuietComfort 35 II',
    price: 329.99,
    promoting: false,
    description:
      'The Bose QuietComfort 35 II headphones offer world-class noise cancellation and premium sound quality, with up to 20 hours of battery life.',
    address: '789 Elm St., Anytown, USA',
    status: 'available',
    img: 'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc35_ii/product_silo_images/qc35_ii_black_EC_hero.PNG/jcr:content/renditions/cq5dam.web.1280.1280.png',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-03 12:00:00',
    updated_at: '2022-02-03 13:00:00',
    total_quantity: 25,
    category_id: 3,
  },

  {
    id: 12,
    seller_id: 104,
    name: 'TV - LG OLED C1',
    price: 1899.99,
    promoting: true,
    description:
      'The LG OLED C1 TV offers stunning picture quality and immersive sound, with features like Dolby Vision IQ and Filmmaker Mode.',
    address: '101 Main St., Anytown, USA',
    status: 'available',
    img: 'https://www.lg.com/ca_en/images/tvs/md07526856/gallery/D-01.jpg',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-04 14:00:00',
    updated_at: '2022-02-04 14:00:00',
    total_quantity: 20,
    category_id: 4,
  },
  {
    id: 13,
    seller_id: 123,
    name: 'Organic Avocado',
    price: 1.99,
    promoting: true,
    description: 'Freshly picked organic avocado from a local farm.',
    address: '123 Main St, Anytown USA',
    status: 'available',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Avocado_Hass_-_single_and_halved.jpg/640px-Avocado_Hass_-_single_and_halved.jpg',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-01T10:00:00',
    updated_at: '2022-02-10T12:00:00',
    total_quantity: 100,
    category_id: 5,
  },
  {
    id: 14,
    seller_id: 234,
    name: 'Grass-fed Beef',
    price: 9.99,
    promoting: false,
    description: 'Tender and juicy beef from free-range, grass-fed cows.',
    address: '456 Elm St, Anytown USA',
    status: 'available',
    img: 'https://cdn.britannica.com/68/143268-050-917048EA/Beef-loin.jpg',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-02T09:00:00',
    updated_at: '2022-02-11T14:00:00',
    total_quantity: 50,
    category_id: 3,
  },
  {
    id: 15,
    seller_id: 345,
    name: 'Organic Strawberries',
    price: 3.49,
    promoting: true,
    description:
      'Sweet and juicy organic strawberries, hand-picked from the farm.',
    address: '789 Oak St, Anytown USA',
    status: 'available',
    img: 'https://zestfulkitchen.com/wp-content/uploads/2019/06/storing-strawberries-cover-736x809.jpg',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-03T08:00:00',
    updated_at: '2022-02-12T11:00:00',
    total_quantity: 200,
    category_id: 5,
  },
  {
    id: 16,
    seller_id: 456,
    name: 'Free-range Chicken Eggs',
    price: 2.99,
    promoting: false,
    description: 'Fresh eggs from free-range chickens, perfect for breakfast.',
    address: '321 Maple St, Anytown USA',
    status: 'available',
    img: 'https://as2.ftcdn.net/v2/jpg/03/06/99/29/1000_F_306992966_T7l06iY9fN1YwNpGhLKjuwd0ZjBW3HUM.jpg',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-04T07:00:00',
    updated_at: '2022-02-13T10:00:00',
    total_quantity: 150,
    category_id: 2,
  },
  {
    id: 17,
    seller_id: 567,
    name: 'Wild-caught Salmon',
    price: 12.99,
    promoting: true,
    description: 'Fresh wild-caught salmon, packed with omega-3 fatty acids.',
    address: '654 Pine St, Anytown USA',
    status: 'available',
    img: 'https://images.squarespace-cdn.com/content/v1/588b94cbd2b85799b9969da3/1591202977502-ILYA3R661CZPPI2T21AK/HH+fish.jpg?format=1000w',
    shipping_constraint: {
      region: 'Canada',
      distance: 10,
    },
    created_at: '2022-02-05T06:00:00',
    updated_at: '2022-02-14T09:00:00',
    total_quantity: 75,
    category_id: 1,
  },
]

export const products = [
  {
    product_uri: '/products/1',
    id: 1,
    name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
    price: 5.87,
    discount: 37,
    description:
      'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
    status: 'instock',
    address: 'Vancouver, BC, V6S 0G8, CA',
    img: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
    category_id: 1,
    total_quantity: 10,
  },
  {
    product_uri: 'products/2',
    id: 2,
    seller_id: 1,
    name: 'Command Medium Picture Hanging Strips Value Pack, 12 Pairs, White - 17204-EF',
    price: 11.77,
    discount: 0, // %
    description:
      'Command picture hanging strips make decorating quick and easy. One click tells you Command picture hanging strips are locked in and holding tight. Best of all, when you are ready to take down or move your pictures, they come off leaving no wall damage, cracked plaster or sticky residue. Command picture hanging strips come in three sizes: small strips hold most 8 in x 10 in (20.32 cm x 25.4 cm) frames, medium strips hold most 18 in x 24 in (45.7 cm x 60.96 cm) frames and large strips hold most 24 in x 36 in (60.96 cm x 91.44 cm) frames. Also available are Command frame stabilizer strips which keep picture frames level even if hung by nails.',
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    category_id: 1,
    img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
    total_quantity: 100,
  },
  {
    product_uri: 'products/3',
    id: 3,
    seller_id: 1,
    name: "Elmer's 60509q Extra Strength Office Glue Stick, 8g (0.28 Oz.) Each, 3-pack",
    price: 3.88,
    discount: 0, // %
    description:
      "Elmer's Products, Inc. is a company rich in history and tradition. Since the 1940's the Elmer's family of products has developed to meet the ever-changing needs of consumers. They range from a full line of adhesives, arts, crafts, and educational products for children to a complete offering of craft, hobby, office, and home repair products for adults.",
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    category_id: 1,
    img: 'https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg',
    total_quantity: 70,
  },
  {
    product_uri: 'products/4',
    id: 4,
    seller_id: 1,
    name: 'Gorilla Fabric Glue, 100% Waterproof, No Sew Solution, Washer/Dryer Safe, Permanent Bond, 2.5fl oz/73ml, Clear, (1-Pack), 8215402',
    price: 9.97,
    discount: 0, // %
    description:
      'Gorilla Fabric Glue is a 100% waterproof, no sew solution for hems, embellishments, trim and more! Formulated to bond fabric, and hard-to-hold embellishments, Gorilla Fabric Glue provides a fast setting, permanent bond that remains flexible after washing.',
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    category_id: 1,
    img: 'https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg',
    total_quantity: 70,
  },
  {
    product_uri: 'products/5',
    id: 5,
    seller_id: 2,
    name: 'Bissell Little Green Proheat Portable Deep Cleaner/Spot Cleaner with self-Cleaning HydroRinse Tool for Carpet and Upholstery 2513B',
    price: 149.97,
    discount: 0, // %
    description:
      "No need to pull out a full-size carpet cleaning Machine every time a stain or spot appear on your carpet. With Bissell little green ProHeat, you can remove tough spots and stains when used with Bissell spot & stain + Oxy. It's a powerful compact cleaning Machine. Built-in heatwave technology maintains consistent water temperature while cleaning for heated cleaning.",
    total_quantity: 40,
    status: 'instock', // preset (outstock, instock)
    address: 'Vancouver, BC, V6S 0G8, CA',
    img: 'https://m.media-amazon.com/images/I/91zBUhFKfWL._AC_SL1500_.jpg',
    category_id: 1,
  },
  {
    product_uri: 'products/6',
    id: 6,
    seller_id: 1,
    name: 'Harry Potter Series 1',
    price: 25.55,
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts",
    status: 'in stock',
    discount: 10.5,
    total_quantity: 1,
    address: 'Fremont, California 94536,US',
    expected_delivery_date: '2023/02/16',
    img: 'https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg',
    category_id: 2,
  },
  {
    product_uri: 'products/7',
    id: 7,
    seller_id: 2,
    name: 'Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal',
    price: 34.5,
    discount: 5.99,
    description:
      'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small spaces.Improved speaker quality - Better speaker quality than Echo Dot Gen 2 for richer and louder sound. Pair with a second Echo Dot for stereo sound.',
    total_quantity: 1,
    status: 'in stock',
    address: 'Seattle, WA 98109, USA',
    expected_delivery_date: '2023/02/19',
    img: 'https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg',
    category_id: 2,
  },
  {
    product_uri: 'products/8',
    id: 8,
    seller_id: 3,
    name: 'Kindle Paperwhite (8 GB) – Now with a 6.8 display and adjustable warm light',
    price: 119.99,
    discount: 10,
    description:
      'Kindle Paperwhite – Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
    total_quantity: 1,
    status: 'low in stock',
    address: 'Seattle, WA 98109, USA',
    expected_delivery_date: '2023/02/11',
    img: 'https://m.media-amazon.com/images/I/61PHZfkhxIL._AC_SL1000_.jpg',
    category_id: 2,
  },
  {
    product_uri: 'products/9',
    id: 9,
    seller_id: 101,
    name: 'Laptop - HP Pavilion',
    price: 899.99,
    promoting: true,
    description:
      'The HP Pavilion Laptop packs more performance into a smaller profile, so you can get more done wherever you go. Enjoy mind-blowing entertainment with a micro-edge screen and Audio by B&O.',
    address: '123 Main St., Anytown, USA',
    status: 'available',
    img: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07963197.png',
    total_quantity: 50,
    category_id: 1,
  },
  {
    product_uri: 'products/10',
    id: 10,
    seller_id: 102,
    name: 'Smartphone - Samsung Galaxy S22',
    price: 1099.99,
    promoting: false,
    description:
      'The Samsung Galaxy S22 is the ultimate smartphone, featuring a 6.4-inch Dynamic AMOLED 2X display, 5G connectivity, and a 64MP camera.',
    address: '456 Oak St., Anytown, USA',
    status: 'available',
    img: 'https://img.global.news.samsung.com/ca/wp-content/uploads/2022/02/Galaxy_S22_Ultra_PR_main1F.jpg',
    total_quantity: 100,
    category_id: 2,
  },
  {
    product_uri: 'products/11',
    id: 11,
    seller_id: 103,
    name: 'Headphones - Bose QuietComfort 35 II',
    price: 329.99,
    promoting: false,
    description:
      'The Bose QuietComfort 35 II headphones offer world-class noise cancellation and premium sound quality, with up to 20 hours of battery life.',
    address: '789 Elm St., Anytown, USA',
    status: 'available',
    img: 'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc35_ii/product_silo_images/qc35_ii_black_EC_hero.PNG/jcr:content/renditions/cq5dam.web.1280.1280.png',
    total_quantity: 25,
    category_id: 3,
  },
  {
    product_uri: 'products/12',
    id: 12,
    seller_id: 104,
    name: 'TV - LG OLED C1',
    price: 1899.99,
    promoting: true,
    description:
      'The LG OLED C1 TV offers stunning picture quality and immersive sound, with features like Dolby Vision IQ and Filmmaker Mode.',
    address: '101 Main St., Anytown, USA',
    status: 'available',
    img: 'https://www.lg.com/ca_en/images/tvs/md07526856/gallery/D-01.jpg',
    total_quantity: 20,
    category_id: 4,
  },
  {
    product_uri: 'products/13',
    id: 13,
    seller_id: 123,
    name: 'Organic Avocado',
    price: 1.99,
    promoting: true,
    description: 'Freshly picked organic avocado from a local farm.',
    address: '123 Main St, Anytown USA',
    status: 'available',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Avocado_Hass_-_single_and_halved.jpg/640px-Avocado_Hass_-_single_and_halved.jpg',
    total_quantity: 100,
    category_id: 5,
  },
  {
    product_uri: 'products/14',
    id: 14,
    seller_id: 234,
    name: 'Grass-fed Beef',
    price: 9.99,
    promoting: false,
    description: 'Tender and juicy beef from free-range, grass-fed cows.',
    address: '456 Elm St, Anytown USA',
    status: 'available',
    img: 'https://cdn.britannica.com/68/143268-050-917048EA/Beef-loin.jpg',
    total_quantity: 50,
    category_id: 3,
  },
  {
    product_uri: 'products/15',
    id: 15,
    seller_id: 345,
    name: 'Organic Strawberries',
    price: 3.49,
    promoting: true,
    description:
      'Sweet and juicy organic strawberries, hand-picked from the farm.',
    address: '789 Oak St, Anytown USA',
    status: 'available',
    img: 'https://zestfulkitchen.com/wp-content/uploads/2019/06/storing-strawberries-cover-736x809.jpg',
    total_quantity: 200,
    category_id: 5,
  },
  {
    product_uri: 'products/16',
    id: 16,
    seller_id: 456,
    name: 'Free-range Chicken Eggs',
    price: 2.99,
    promoting: false,
    description: 'Fresh eggs from free-range chickens, perfect for breakfast.',
    address: '321 Maple St, Anytown USA',
    status: 'available',
    img: 'https://as2.ftcdn.net/v2/jpg/03/06/99/29/1000_F_306992966_T7l06iY9fN1YwNpGhLKjuwd0ZjBW3HUM.jpg',
    total_quantity: 150,
    category_id: 2,
  },
  {
    product_uri: 'products/17',
    id: 17,
    seller_id: 567,
    name: 'Wild-caught Salmon',
    price: 12.99,
    promoting: true,
    description: 'Fresh wild-caught salmon, packed with omega-3 fatty acids.',
    address: '654 Pine St, Anytown USA',
    status: 'available',
    img: 'https://images.squarespace-cdn.com/content/v1/588b94cbd2b85799b9969da3/1591202977502-ILYA3R661CZPPI2T21AK/HH+fish.jpg?format=1000w',
    total_quantity: 75,
    category_id: 1,
  },
]
