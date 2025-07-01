const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const response = await fetch('http://157.230.240.97:9999/api/v1/categories');
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching categories' }),
    };
  }
};