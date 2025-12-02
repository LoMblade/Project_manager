// Script để thay thế base64 images thành URL đơn giản
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

let imageCounter = 10; // Bắt đầu từ 10 để không trùng với ảnh hiện có

data.products.forEach(product => {
  if (product.image && product.image.startsWith('data:image')) {
    console.log(`Replacing base64 image for ${product.code}`);
    product.image = `https://picsum.photos/300/200?random=${imageCounter}`;
    imageCounter++;
  }
});

fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
console.log('Đã thay thế tất cả base64 images thành URL đơn giản!');
