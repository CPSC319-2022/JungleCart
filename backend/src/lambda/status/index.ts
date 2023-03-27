// handles routing and sends request
exports.handler = async function (event) {
  return await status(event);
};

// handlers
export async function status(event): Promise<any> {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({ message: 'API resource is active' }),
  };
}
