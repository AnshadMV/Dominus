import { OrderItem } from "./orderItem.model";
import { ShippingDetails } from "./shippingDetails.model";

// Interface for Order
export interface Order {
  id: string;
  userId: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  shippingDetails: ShippingDetails;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
}