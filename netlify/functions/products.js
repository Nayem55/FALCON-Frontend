const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { url } = event.queryStringParameters || {};
  const targetUrl = url || 'http://157.230.240.97:9999/api/v1/shop/products';
  
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};