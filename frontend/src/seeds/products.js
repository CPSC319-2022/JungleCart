export const products = {
  products: [
    {
      id: 1,
      seller_id: 1,
      name: 'Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting',
      price: 5.87,
      discount: 37, // %
      description:
        'Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.',
      status: 'instock', // preset (outstock, instock)
      address: 'Vancouver, BC, V6S 0G8, CA',
      shipping_constraint: [
        {
          region: 'BC',
          distance: 14.3, // float (km based)
        },
      ],
      img: ['https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg'],
      total_quantity: 10,
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
      img: ['https://m.media-amazon.com/images/I/71qv4dZZgIL._AC_SL1500_.jpg'],
      category_id: 1,
    },

    {
      id: 3,
      seller_id: 1,
      name: "Elmer's Extra Strength Glue Sticks, Washable, 8 Grams, 4 Count",
      price: 5.99,
      discount: 0, // %
      description:
        "Elmer's glue sticks provide a smooth, less messy, and easy way to bond paper or other common objects for home, office, or arts and craft use. Extra strength formula dries 2 times faster than Elmer's regular glue sticks. Strong bonding glue sticks are ideal for use on display board, foam board, cardboard, computer paper, and more. Non-toxic and washable glue is safe to use and washes off simply with soap and water. Acid-free and photo-safe glue stick formula also make it compatible for firmly adhering pictures without need for reapplying. ",
      total_quantity: 70,
      status: 'instock', // preset (outstock, instock)
      address: 'Vancouver, BC, V6S 0G8, CA',
      shipping_constraint: [
        {
          region: 'BC',
          distance: 10.0, // float (km based)
        },
      ],
      img: ['https://m.media-amazon.com/images/I/91S4ZONVemL._AC_SL1500_.jpg'],
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
      img: ['https://m.media-amazon.com/images/I/71CyAeNlR7L._AC_SL1500_.jpg'],
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
      img: ['https://m.media-amazon.com/images/I/91zBUhFKfWL._AC_SL1500_.jpg'],
      category_id: 1,
    },
    {
      id: 6,
      seller_id: 1,
      name: 'Harry Potter (7 book series)',
      price: 69.93,
      description:
        "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts",
      status: 'in stock',
      discount: 10.5,
      total_quantity: 1,
      address: 'Fremont, California 94536, US',
      expected_delivery_date: '2023/02/16',
      shipping_constraint: {
        region: 'BC',
      },
      img: ['https://m.media-amazon.com/images/I/71rOzy4cyAL._AC_UY436_QL65_SP_SAME_DOMAIN_ASSETS_257061_.jpg'],
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
      img: ['https://m.media-amazon.com/images/I/61RNVt9kXUL._AC_SL1000_.jpg'],
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
      shipping_constraint: {
        region: 'Canada',
        distance: 10,
      },
      img: [
        'https://m.media-amazon.com/images/I/61PHZfkhxIL._AC_SL1000_.jpg',
        'https://m.media-amazon.com/images/G/15/kindle/dp/2019/rb26dett/s/S_Desktop_Pack_1_Image_v1._CB441119230_.jpg',
      ],
      category_id: 2,
    },
  ],
};
