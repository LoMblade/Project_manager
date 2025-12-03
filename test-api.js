const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/products/1',
  method: 'GET'
};

console.log('Testing API with ID: 1');

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const product = JSON.parse(data);
      console.log('Parsed product ID:', product.id, 'Type:', typeof product.id);
    } catch (e) {
      console.log('Could not parse JSON');
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();

console.log('Testing API...');

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
    try {
      const product = JSON.parse(data);
      console.log('Parsed product:', product);
    } catch (e) {
      console.log('Could not parse JSON');
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.end();
