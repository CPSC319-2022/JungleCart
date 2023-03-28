// handles routing and sends request
exports.handler = async function () {
  return await status();
};

// handlers
export async function status(): Promise<unknown> {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({ message: 'API resource is active' }),
  };
}
