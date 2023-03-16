// noinspection SqlNoDataSourceInspection
// Object.defineProperty(exports, "__esModule", { value: true });

const sql_layer_1 = require("/opt/sql-layer");
//sql_layer_1.SQLConnectionManager.createConnection(true);
const error_layer_1 = require("/opt/customError-layer");

const aws_layer_1 = require("/opt/sdk-layer");
const AWS = aws_layer_1.SDK.AWS;
AWS.config.update({ region: 'us-west-2' });
const ses = new AWS.SES();
exports.handler = async function (event) {
    const sourceEmail = 'junglecart.gorillas@gmail.com';
    // const user = event.body.user;
    const order = event.body.order;
    // const showTable = `SHOW TABLES`;
    // const tables = await sql_layer_1.SQLConnectionManager.queryPool(showTable);
    // console.log(tables);
    const orderId = order.id;
    const sqlGetBuyerId = `SELECT buyer_id FROM sqlDB.orders o WHERE o.id = ${orderId}`;
    const buyerId = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetBuyerId)))[0]).buyer_id;
    const sqlGetBuyerName = `SELECT first_name FROM sqlDB.user u WHERE u.id = ${buyerId}`;
    const buyerName = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetBuyerName))))[0].first_name;
    const sqlGetBuyerEmail = `SELECT email FROM sqlDB.user u WHERE u.id = ${buyerId}`;
    const destinationEmail = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetBuyerEmail))))[0].email;
    const sqlGetOrderItems = `SELECT * from sqlDB.order_item oi WHERE oi.order_id = ${orderId}`;
    const orderItems = await (sql_layer_1.SQLConnectionManager.queryPool(sqlGetOrderItems));
    
    let emailBody = `<h1> Hello! ${buyerName} </h1> <br> <h3>Good news! Your recent order: #${orderId} has been <b>shipped! </b> </h3> <h2> Order details: </h2><br>`;
    const emailEnd = `<br> Best Regards, <br> Jungle Cart Team <br> <b><a href="https://main.d80mxyatc2g3o.amplifyapp.com/products?page=1"> Click here to go to home page </a></b>`;

    const shipped = 3;

    
    
    let tempShippingStatusId = 0;
    let tempProductId = 0;
    let tempQueryResult = null;
    
    const sqlUpdateOrderStatus = `UPDATE sqlDB.orders SET order_status_id = ${shipped} WHERE id = ${orderId}`;
    await sql_layer_1.SQLConnectionManager.queryPool(sqlUpdateOrderStatus);
    
    let sqlUpdateShippingStatus = `UPDATE sqlDB.shipping_status SET status = 'shipped' WHERE id = ${tempShippingStatusId}`;
    let sqlGetProductName = `SELECT name FROM sqlDB.product WHERE id=${tempProductId}`;
    for (let i = 0; i < orderItems.length; i++) {
        //adds product name to the email body and modify shipping status
        tempShippingStatusId = orderItems[i].shipping_status_id;
        sqlUpdateShippingStatus = `UPDATE sqlDB.shipping_status SET status = 'shipped' WHERE id = ${tempShippingStatusId}`;
        
        await sql_layer_1.SQLConnectionManager.queryPool(sqlUpdateShippingStatus);
        tempProductId = orderItems[i].product_id;
        sqlGetProductName = `SELECT name FROM sqlDB.product WHERE id=${tempProductId}`;
        tempQueryResult = (JSON.parse(JSON.stringify(await sql_layer_1.SQLConnectionManager.queryPool(sqlGetProductName))))[0].name;
        emailBody += `<h3> ${tempQueryResult} * ${orderItems[i].quantity} </h3> <br>`;
    }
    emailBody += emailEnd;
    const params = {
        Destination: {
            ToAddresses: [
                destinationEmail,
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: emailBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "Hello!"
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: "Thank you! Your order has been shipped."
            }
        },
        Source: 'junglecart.gorillas@gmail.com',
        ReplyToAddresses: [
            'junglecart.gorillas@gmail.com',
        ],
    };
    const res = await ses.sendEmail(params).promise().then(result => {
        console.log("successfully sent the email");
        console.log(result);
    });
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Shipping completed successfully' }),
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGFtYmRhL3NoaXBwaW5nLWxhbWJkYS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUNBQXlDOztBQUV6Qyw4REFBOEQ7QUFFOUQsOENBQXNEO0FBQ3RELGdDQUFvQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBRTVDLDhEQUE4RDtBQUM5RCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztBQUN6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssV0FBVyxLQUFLO0lBQ3JDLE1BQU0sV0FBVyxHQUFHLCtCQUErQixDQUFDO0lBQ3BELGdDQUFnQztJQUNoQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUM3Qiw0TkFBNE47SUFDOU4sdUVBQXVFO0lBQ3JFLHdNQUF3TTtJQUN4TSxNQUFNLGVBQWUsR0FBRyw4Q0FBOEMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pGLE1BQU0sU0FBUyxHQUFHLE1BQU0sZ0NBQW9CLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRXhFLE1BQU0sZ0JBQWdCLEdBQUcsK0NBQStDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6RixNQUFNLGdCQUFnQixHQUFHLE1BQU0sZ0NBQW9CLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFFaEYsTUFBTSxnQkFBZ0IsR0FBRyx5REFBeUQsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQzdGLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxnQ0FBb0IsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzVFLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBRTVELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQztJQUVsQixJQUFJLFNBQVMsR0FBRyxlQUFlLFNBQVMsa0RBQWtELEtBQUssQ0FBQyxFQUFFLGtDQUFrQyxDQUFDO0lBQ3JJLE1BQU0sUUFBUSxHQUFHLDBDQUEwQyxDQUFDO0lBQzVELE1BQU0sb0JBQW9CLEdBQUcsbURBQW1ELE9BQU8sZUFBZSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDakgsTUFBTSx1QkFBdUIsR0FBRyxnRUFBZ0UsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pILElBQUksZ0NBQWdDLEdBQUcsRUFBRSxDQUFDO0lBQzFDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUduQixvREFBb0Q7SUFFcEQsSUFBSTtJQUVKLHVEQUF1RDtJQUN2RCw4SkFBOEo7SUFDOUoseURBQXlEO0lBRXpELG1CQUFtQjtJQUNuQix3REFBd0Q7SUFDeEQsZ0JBQWdCO0lBQ2hCLFFBQVE7SUFDUixxQ0FBcUM7SUFDckMsNklBQTZJO0lBQzdJLCtDQUErQztJQUMvQyxRQUFRO0lBQ1IsSUFBSTtJQUVKLCtCQUErQjtJQUUvQixNQUFNLE1BQU0sR0FBRztRQUNiLFdBQVcsRUFBRTtZQUNYLFdBQVcsRUFBRTtnQkFDWCxnQkFBZ0I7YUFDakI7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUU7b0JBQ04sT0FBTyxFQUFFLE9BQU87b0JBQ2hCLElBQUksRUFBRSxTQUFTO2lCQUNkO2dCQUNELElBQUksRUFBRTtvQkFDTixPQUFPLEVBQUUsT0FBTztvQkFDaEIsSUFBSSxFQUFFLFFBQVE7aUJBQ2I7YUFDRDtZQUNELE9BQU8sRUFBRTtnQkFDUixPQUFPLEVBQUUsT0FBTztnQkFDaEIsSUFBSSxFQUFFLHlDQUF5QzthQUMvQztTQUNEO1FBQ0gsTUFBTSxFQUFFLFdBQVc7UUFDbkIsZ0JBQWdCLEVBQUU7WUFDZixXQUFXO1NBQ2I7S0FDRixDQUFDO0lBRUYsTUFBTSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU87UUFDTCxVQUFVLEVBQUUsR0FBRztRQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLENBQUM7S0FDckUsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIG5vaW5zcGVjdGlvbiBTcWxOb0RhdGFTb3VyY2VJbnNwZWN0aW9uXHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xyXG5cclxuaW1wb3J0IHsgU1FMQ29ubmVjdGlvbk1hbmFnZXIgfSBmcm9tICcvb3B0L3NxbC1sYXllcic7XHJcblNRTENvbm5lY3Rpb25NYW5hZ2VyLmNyZWF0ZUNvbm5lY3Rpb24odHJ1ZSk7XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xyXG5jb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XHJcblxyXG5BV1MuY29uZmlnLnVwZGF0ZSh7cmVnaW9uOiAndXMtd2VzdC0yJ30pO1xyXG5jb25zdCBzZXMgPSBuZXcgQVdTLlNFUygpO1xyXG5cclxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgY29uc3Qgc291cmNlRW1haWwgPSAnanVuZ2xlY2FydC5nb3JpbGxhc0BnbWFpbC5jb20nO1xyXG4gIC8vIGNvbnN0IHVzZXIgPSBldmVudC5ib2R5LnVzZXI7XHJcbiAgY29uc3Qgb3JkZXIgPSBldmVudC5ib2R5Lm9yZGVyO1xyXG4gICAgLy9cImJ1aWxkX25vZGVfbGF5ZXJcIjogXCJta2RpciAtcCAuXFxcXGRpc3RcXFxcc3JjXFxcXGxheWVyXFxcXG5vZGVqcyAmJiAgY3AgLlxcXFxwYWNrYWdlLmpzb24gLlxcXFxkaXN0XFxcXHNyY1xcXFxsYXllclxcXFxub2RlanNcXFxccGFja2FnZS5qc29uICYmIG5wbSAtLXByZWZpeCAuXFxcXGRpc3RcXFxcc3JjXFxcXGxheWVyXFxcXG5vZGVqc1xcXFwgaW5zdGFsbCAuXFxcXGRpc3RcXFxcc3JjXFxcXGxheWVyXFxcXG5vZGVqc1xcXFwgLS1vbWl0PWRldlwiXHJcbiAgLy8gRDpcXEp1bmdsZUNhcnRcXEp1bmdsZUNhcnRcXGJhY2tlbmRcXHNyY1xcbGFtYmRhXFxzaGlwcGluZy1sYW1iZGFcXGluZGV4LnRzXHJcbiAgICAvL1wiYnVpbGRfbm9kZV9sYXllclwiOiBcIm1rZGlyIC1wIC4vZGlzdC9zcmMvbGF5ZXIvbm9kZWpzICYmICBjcCAuL3BhY2thZ2UuanNvbiAuL2Rpc3Qvc3JjL2xheWVyL25vZGVqcy9wYWNrYWdlLmpzb24gJiYgbnBtIC0tcHJlZml4IC4vZGlzdC9zcmMvbGF5ZXIvbm9kZWpzLyBpbnN0YWxsIC4vZGlzdC9zcmMvbGF5ZXIvbm9kZWpzLyAtLW9taXQ9ZGV2XCJcclxuICAgIGNvbnN0IHNxbEdldEJ1eWVyTmFtZSA9IGBTRUxFQ1QgbmFtZSBGUk9NIHNxbERCLnVzZXIgdSBXSEVSRSB1LmlkID0gJHtvcmRlci5idXllcl9pZH1gO1xyXG4gIGNvbnN0IGJ1eWVyTmFtZSA9IGF3YWl0IFNRTENvbm5lY3Rpb25NYW5hZ2VyLnF1ZXJ5UG9vbChzcWxHZXRCdXllck5hbWUpO1xyXG5cclxuICBjb25zdCBzcWxHZXRCdXllckVtYWlsID0gYFNFTEVDVCBlbWFpbCBGUk9NIHNxbERCLnVzZXIgdSBXSEVSRSB1LmlkID0gJHtvcmRlci5idXllcl9pZH1gO1xyXG4gIGNvbnN0IGRlc3RpbmF0aW9uRW1haWwgPSBhd2FpdCBTUUxDb25uZWN0aW9uTWFuYWdlci5xdWVyeVBvb2woc3FsR2V0QnV5ZXJFbWFpbCk7XHJcblxyXG4gIGNvbnN0IHNxbEdldE9yZGVySXRlbXMgPSBgU0VMRUNUICogZnJvbSBzcWxEQi5vcmRlcl9pdGVtIG9pIFdIRVJFIG9pLm9yZGVyX2lkID0gJHtvcmRlci5pZH1gO1xyXG4gIGNvbnN0IG9yZGVySXRlbXMgPSBhd2FpdCAoU1FMQ29ubmVjdGlvbk1hbmFnZXIucXVlcnlQb29sKHNxbEdldE9yZGVySXRlbXMpKTtcclxuICBsZXQganNvbk9yZGVySXRlbXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9yZGVySXRlbXMpKTtcclxuICBcclxuICBjb25zdCBzaGlwcGVkID0gMztcclxuXHJcbiAgbGV0IGVtYWlsQm9keSA9IGA8aDE+IEhlbGxvISAke2J1eWVyTmFtZX0gPC9oMT4gPGJyPiA8aDM+R29vZCBuZXdzISBZb3VyIHJlY2VudCBvcmRlcjogIyR7b3JkZXIuaWR9IGhhcyBiZWVuIDxiPnNoaXBwZWQhIDwvYj4gPC9oMz5gO1xyXG4gIGNvbnN0IGVtYWlsRW5kID0gYDxicj4gQmVzdCBSZWdhcmRzLCA8YnI+IEp1bmdsZSBDYXJ0IFRlYW1gO1xyXG4gIGNvbnN0IHNxbFVwZGF0ZU9yZGVyU3RhdHVzID0gYFVQREFURSBzcWxEQi5vcmRlcl9zdGF0dXMgU0VUIG9yZGVyX3N0YXR1c19pZCA9ICR7c2hpcHBlZH0gV0hFUkUgaWQgPSAke29yZGVyLmlkfWA7XHJcbiAgY29uc3Qgc3FsVXBkYXRlU2hpcHBpbmdTdGF0dXMgPSBgVVBEQVRFIHNxbERCLnNoaXBwaW5nX3N0YXR1cyBTRVQgc3RhdHVzID0gc2hpcHBlZCBXSEVSRSBpZCA9ICR7b3JkZXIuc2hpcHBpbmd9YDtcclxuICBsZXQgc3FsTGlua09yZGVySXRlbVRvU2hpcHBpbmdTdGF0dXMgPSAnJztcclxuICBsZXQgbGFzdEluc2VydCA9IDA7XHJcblxyXG4gIFxyXG4gIC8vIGZvciAobGV0IGkgPSAwOyBpIDwganNvbk9yZGVySXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgIFxyXG4gIC8vIH1cclxuXHJcbiAgLy8gZm9yIChsZXQgaSA9IDAgOyBpIDwgb3JkZXIub3JkZXJfaXRlbS5sZW5ndGg7IGkrKykge1xyXG4gIC8vICAgc3FsQ3JlYXRlU2hpcHBpbmdTdGF0dXMgPSBgSU5TRVJUIElOVE8gc3FsREIuc2hpcHBpbmdfc3RhdHVzIChTVEFUVVMsIEVYUEVDVEVEX0RFTElWRVJZX0RBVEUpIFZBTFVFUyAoJ3NoaXBwaWVkJywgJHtvcmRlci5vcmRlcl9pdGVtW2ldLmV4cGVjdGVkRGF0ZX0pO2A7XHJcbiAgLy8gICBxdWVyeShzcWxDcmVhdGVTaGlwcGluZ1N0YXR1cywgKGVycm9yLCByZXN1bHRzKSA9PiB7XHJcbiAgICAgIFxyXG4gIC8vICAgICBpZiAoZXJyb3IpIHtcclxuICAvLyAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBleGVjdXRpbmcgcXVlcnk6JywgZXJyb3IpO1xyXG4gIC8vICAgICAgIHJldHVybjtcclxuICAvLyAgICAgfVxyXG4gIC8vICAgICBsYXN0SW5zZXJ0ID0gcmVzdWx0cy5pbnNlcnRJZDtcclxuICAvLyAgICAgc3FsTGlua09yZGVySXRlbVRvU2hpcHBpbmdTdGF0dXMgPSAnVVBEQVRFIHNxbERCLm9yZGVyX2l0ZW0gU0VUIHNoaXBwaW5nX3N0YXR1c19pZCA9ICR7bGFzdEluc2VydH0gV0hFUkUgaWQgPSAke29yZGVyLm9yZGVyX2l0ZW1baV19JztcclxuICAvLyAgICAgcXVlcnkoc3FsTGlua09yZGVySXRlbVRvU2hpcHBpbmdTdGF0dXMpO1xyXG4gIC8vICAgfSk7XHJcbiAgLy8gfVxyXG4gIFxyXG4gIC8vIHF1ZXJ5KHNxbFVwZGF0ZU9yZGVyU3RhdHVzKTtcclxuXHJcbiAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgRGVzdGluYXRpb246IHsgLyogcmVxdWlyZWQgKi9cclxuICAgICAgVG9BZGRyZXNzZXM6IFtcclxuICAgICAgICBkZXN0aW5hdGlvbkVtYWlsLFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgTWVzc2FnZTogeyAvKiByZXF1aXJlZCAqL1xyXG4gICAgICBCb2R5OiB7IC8qIHJlcXVpcmVkICovXHJcbiAgICAgICAgSHRtbDoge1xyXG4gICAgICAgIENoYXJzZXQ6IFwiVVRGLThcIixcclxuICAgICAgICBEYXRhOiBlbWFpbEJvZHlcclxuICAgICAgICB9LFxyXG4gICAgICAgIFRleHQ6IHtcclxuICAgICAgICBDaGFyc2V0OiBcIlVURi04XCIsXHJcbiAgICAgICAgRGF0YTogXCJIZWxsbyFcIlxyXG4gICAgICAgIH1cclxuICAgICAgIH0sXHJcbiAgICAgICBTdWJqZWN0OiB7XHJcbiAgICAgICAgQ2hhcnNldDogJ1VURi04JyxcclxuICAgICAgICBEYXRhOiBcIlRoYW5rIHlvdSEgWW91ciBvcmRlciBoYXMgYmVlbiBzaGlwcGVkLlwiXHJcbiAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICBTb3VyY2U6IHNvdXJjZUVtYWlsLFxyXG4gICAgUmVwbHlUb0FkZHJlc3NlczogW1xyXG4gICAgICAgc291cmNlRW1haWwsXHJcbiAgICBdLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlcyA9IGF3YWl0IHNlcy5zZW5kRW1haWwocGFyYW1zKS5wcm9taXNlKCkudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJzdWNjZXNzZnVsbHkgc2VudCB0aGUgZW1haWxcIik7XHJcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiAnU2hpcHBpbmcgY29tcGxldGVkIHN1Y2Nlc3NmdWxseScgfSksXHJcbiAgfTtcclxufTtcclxuIl19