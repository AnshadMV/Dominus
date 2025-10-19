export interface ProductForm {
  name: string;
  sku: string;
  description: string;
  price: number;
  comparePrice: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'draft';
}

export interface Product extends ProductForm {
  id?: string | number;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}