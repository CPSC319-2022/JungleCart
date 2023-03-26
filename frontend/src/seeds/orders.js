export const orders = {
  orders: [
    {
      id: 1,
      status: 'in progress',
      products: [
        {
          id: 6,
          product_uri: 'products/6',
          name: 'Harry Potter (7 book series)',
          price: 69.93,
          description:
            "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts",
          img: 'https://m.media-amazon.com/images/I/71rOzy4cyAL._AC_UY436_QL65_SP_SAME_DOMAIN_ASSETS_257061_.jpg',
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
  ],
};
