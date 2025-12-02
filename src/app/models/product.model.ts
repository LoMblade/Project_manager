export interface Product {
  id?: number;
  code: string;
  name: string;
  importPrice: number;
  salePrice: number;
  description?: string;
  image?: string;
  category?: string;
}