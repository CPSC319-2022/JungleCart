exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event, undefined, 2));
    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify([{
            "id": 1,
            "seller_id": 1,
            "name": "Crayola 52-0096 96 Crayons, School and Craft Supplies, Gift for Boys and Girls, Kids, Ages 3,4, 5, 6 and Up, Back to school, School supplies, Arts and Crafts, Gifting",
            "price": 5.87,
            "discount": 37, // %
            "description": "Classic Crayola crayons True hues and intense brightness in a huge variety of colors Kids’ art tools are double wrapped for extra strength includes 96 different crayon colors and built-in sharpener Perfect art tool for arts, crafts and creative fun.",
            "status": "instock",  // preset (outstock, instock)
            "address": "Vancouver, BC, V6S 0G8, CA",
            "shipping_constraint": [
                {
                    "region": "BC",
                    "distance": 14.3,  // float (km based)
                }
            ],
            "img": ["https://m.media-amazon.com/images/I/714VaWknZsL._AC_SL1500_.jpg"],
            "total_quantity": 10,
            "category_id": 1
        }])
    };
}