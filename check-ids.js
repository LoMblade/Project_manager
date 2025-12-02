// Script để kiểm tra ID của các sản phẩm SP004, SP005, SP006
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

const problematicCodes = ['SP004', 'SP005', 'SP006'];

data.products.forEach(product => {
  if (problematicCodes.includes(product.code)) {
    console.log(`Product ${product.code}:`);
    console.log(`  ID: ${product.id} (type: ${typeof product.id})`);
    console.log(`  Parsed ID: ${+product.id} (isNaN: ${isNaN(+product.id)})`);
    console.log('---');
  }
});
