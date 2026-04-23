const http = require('http');

const postData = JSON.stringify({
  name: "Main Warehouse",
  region: "North America",
  capacity: 10000,
  currentStock: 5000,
  operatingCost: 50000,
  status: "active"
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/warehouses',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('POST Response:', data);
    
    // Now fetch all warehouses
    http.get('http://localhost:5000/api/warehouses', (res2) => {
      let data2 = '';
      res2.on('data', (chunk) => { data2 += chunk; });
      res2.on('end', () => {
        console.log('GET Response:', data2);
      });
    });
  });
});

req.write(postData);
req.end();
