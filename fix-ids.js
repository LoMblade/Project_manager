// Script để sửa ID của các sản phẩm thành number
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Sửa ID cho các sản phẩm có vấn đề
const idMapping = {
  'aaa3': 5,  // SP004
  'ec61': 6,  // SP005
  '1da5': 7   // SP006
};

data.products.forEach(product => {
  if (idMapping[product.id]) {
    console.log(`Fixing ID for ${product.code}: ${product.id} -> ${idMapping[product.id]}`);
    product.id = idMapping[product.id];
  }
});

fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
console.log('Đã sửa ID cho các sản phẩm có vấn đề!');
