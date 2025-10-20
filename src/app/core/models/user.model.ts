
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  role: string;
  // cart:string[];
  wishlist:string[];
  orders:string[];
  isBlocked?: boolean;
  blockedAt?: string; 
  blockedReason?: string; 
}