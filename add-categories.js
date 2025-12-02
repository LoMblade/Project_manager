// Script để thêm category vào db.json
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Thêm category cho từng sản phẩm
data.products.forEach(product => {
  if (!product.category) {
    // Gán category ngẫu nhiên
    const categories = ['Thực phẩm', 'Đồ uống', 'Phụ kiện'];
    product.category = categories[Math.floor(Math.random() * categories.length)];
  }
});

fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
console.log('Đã thêm category cho tất cả sản phẩm!');
