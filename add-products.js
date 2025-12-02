// Script để thêm sản phẩm với các category khác nhau
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Thêm sản phẩm mới với các category khác nhau
const newProducts = [
  {
    "id": 8,
    "code": "SP008",
    "name": "Coca Cola",
    "importPrice": 8000,
    "salePrice": 12000,
    "description": "Nước ngọt có gas",
    "image": "https://picsum.photos/300/200?random=20",
    "category": "Đồ uống"
  },
  {
    "id": 9,
    "code": "SP009",
    "name": "Pepsi",
    "importPrice": 7500,
    "salePrice": 11000,
    "description": "Nước ngọt Pepsi",
    "image": "https://picsum.photos/300/200?random=21",
    "category": "Đồ uống"
  },
  {
    "id": 10,
    "code": "SP010",
    "name": "Áo thun nam",
    "importPrice": 50000,
    "salePrice": 80000,
    "description": "Áo thun cotton",
    "image": "https://picsum.photos/300/200?random=22",
    "category": "Phụ kiện"
  },
  {
    "id": 11,
    "code": "SP011",
    "name": "Quần jean nữ",
    "importPrice": 120000,
    "salePrice": 200000,
    "description": "Quần jean skinny",
    "image": "https://picsum.photos/300/200?random=23",
    "category": "Phụ kiện"
  },
  {
    "id": 12,
    "code": "SP012",
    "name": "Sprite",
    "importPrice": 8500,
    "salePrice": 12500,
    "description": "Nước ngọt Sprite",
    "image": "https://picsum.photos/300/200?random=24",
    "category": "Đồ uống"
  }
];

data.products.push(...newProducts);

fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
console.log('Đã thêm 5 sản phẩm mới với các category khác nhau!');


