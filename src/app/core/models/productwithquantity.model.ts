import { Product } from "./product.model";


// Interface for products with quantity
export interface ProductWithQuantity extends Product {
  quantity: number;
}