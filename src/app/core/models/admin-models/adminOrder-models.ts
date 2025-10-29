import { Order } from "src/app/core/models/order.model";

export interface AdminOrder extends Order {
  userName: string;
  userEmail: string;
}