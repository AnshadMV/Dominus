import { Product } from "./product.model";

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}