import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { website_constants } from 'src/app/core/constants/app.constant';
import { Order } from 'src/app/core/models/order.model';
import { OrderItem } from 'src/app/core/models/orderItem.model';
import { Product } from 'src/app/core/models/product.model';
import { ProductWithQuantity } from 'src/app/core/models/productwithquantity.model';
import { ShippingDetails } from 'src/app/core/models/shippingDetails.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-product-buy',
  templateUrl: './product-buy.component.html',
  styleUrls: ['./product-buy.component.css']
})
export class ProductBuyComponent implements OnInit {
  private productsUrl = website_constants.API.PRODUCTURL;
  private usersUrl = website_constants.API.USERURL;
  products: ProductWithQuantity[] = [];
  TotalAmountofSelectedProduct: number = 0;
  userId: string = '';
  isProcessing: boolean = false;
  isLoading = false;
  showBuy: boolean = false;

  constructor(
    private router: Router,
    private toast: ToastService,
    private http: HttpClient
  ) {
    const nav = this.router.getCurrentNavigation();
    const received = nav?.extras?.state?.['product'];
    this.products = Array.isArray(received) ? received : [received];
    console.log('Received product:', this.products);
  }

  ngOnInit(): void {
    this.CalculateTotalSelectedProduct();

    // Get current user ID
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = currentUser?.id || '';
  }

  CalculateTotalSelectedProduct() {
    if (!this.products || this.products.length === 0) {
      this.TotalAmountofSelectedProduct = 0;
      return;
    }

    // Calculate total by multiplying price with quantity
    this.TotalAmountofSelectedProduct = this.products.reduce(
      (total: number, product: ProductWithQuantity) => {
        const price = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 1;
        return total + (price * quantity);
      },
      0
    );
  }

  confirmPurchace(): void {
    if (this.isProcessing) {
      return;
    }

    if (!this.products || this.products.length === 0) {
      this.toast.error("No products to purchase");
      return;
    }

    // Add debugging logs
    console.log('=== STOCK DEBUG INFO ===');
    this.products.forEach(product => {
      console.log(`Product: ${product.name}, Current Stock: ${product.stock}, Quantity: ${product.quantity}, New Stock: ${product.stock === null ? 'unlimited' : (Number(product.stock) - Number(product.quantity || 1))}`);
    });

    // Treat null (or undefined) stock as "unlimited" => not out of stock
    const outOfStockProducts = this.products.filter(product => {
      if (product.stock == null) { // null or undefined = unlimited
        return false;
      }
      const availableStock = Number(product.stock) || 0;
      const requestedQuantity = Number(product.quantity) || 1;
      return availableStock < requestedQuantity;
    });

    if (outOfStockProducts.length > 0) {
      const productNames = outOfStockProducts.map(p => p.name).join(', ');
      this.toast.error(`Insufficient stock for: ${productNames}`);
      return;
    }

    this.isProcessing = true;

    // Create an array of update requests for each product that actually tracks stock.
    // Skip products with null/undefined stock (unlimited).
    const stockUpdateRequests = this.products.map(product => {
      if (product.stock == null) {
        // No request for unlimited stock items (keep as null on server)
        console.log(`Skipping stock update for ${product.name} (unlimited)`);
        return null;
      }

      const availableStock = Number(product.stock) || 0;
      const requestedQuantity = Number(product.quantity) || 1;

      if (availableStock < requestedQuantity) {
        // Shouldn't happen because of earlier check, but guard anyway
        throw new Error(`Not enough stock for ${product.name}`);
      }

      const newStock = availableStock - requestedQuantity;
      console.log(`Updating ${product.name}: ${availableStock} - ${requestedQuantity} = ${newStock}`);

      return this.http.patch(`${this.productsUrl}/${product.id}`, { stock: newStock });
    }).filter(req => req !== null) as any[]; // filter out nulls

    const proceedWithOrder = () => {
      return this.createOrder();
    };

    if (stockUpdateRequests.length === 0) {
      // No stock updates required (all unlimited) — proceed directly
      proceedWithOrder().subscribe({
        next: () => {
          this.toast.success("Purchase Confirmed Successfully!");
          this.isProcessing = false;
          this.router.navigate(['/app-orders']);
        },
        error: (err) => {
          console.error('Error during purchase:', err);
          this.toast.error("Purchase failed. Please try again.");
          this.isProcessing = false;
        }
      });
    } else {
      // Execute all stock updates then create order
      forkJoin(stockUpdateRequests).pipe(
        switchMap((responses) => {
          console.log('Stock update responses:', responses);
          return proceedWithOrder();
        }),
      ).subscribe({
        next: () => {
          this.toast.success("Purchase Confirmed Successfully!");
          this.isProcessing = false;
          this.router.navigate(['/app-orders']);
        },
        error: (err) => {
          console.error('Error during purchase:', err);
          this.toast.error("Purchase failed. Please try again.");
          this.isProcessing = false;
        }
      });
    }
  }

  createOrder() {
    // Get user details for shipping information
    return this.http.get<any>(`${this.usersUrl}/${this.userId}`).pipe(
      switchMap(user => {
        // Create order items from products
        const orderItems: OrderItem[] = this.products.map(product => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          image: product.images[0],
          color: product.colors[0] || 'default',
          category: product.category
        }));

        // Generate order ID
        const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

        // Use user's shippingDetails if available, otherwise provide defaults
        const shippingDetails: ShippingDetails = user.shippingDetails || {
          fullName: user.name || 'Customer',
          address: 'Not specified',
          city: 'Not specified',
          state: 'Not specified',
          pincode: '000000',
          phone: 'Not specified',
          email: user.email || 'Not specified'
        };

        // Create new order
        const newOrder: Order = {
          id: 'order_' + Date.now(),
          userId: this.userId,
          orderId: orderId,
          orderDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          items: orderItems,
          shippingDetails: shippingDetails,
          paymentMethod: 'Online Payment', // You can make this dynamic
          totalAmount: this.TotalAmountofSelectedProduct,
          status: 'confirmed',
          estimatedDelivery: this.calculateEstimatedDelivery()
        };

        // Add order to user's orders array
        const updatedOrders = [...(user.orders || []), newOrder];

        // Update user with new order
        return this.http.patch(`${this.usersUrl}/${this.userId}`, {
          orders: updatedOrders
        });
      })
    );
  }

  calculateEstimatedDelivery(): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
    return deliveryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  clearCartItems(): void {
    this.http.get<any>(`${this.usersUrl}/${this.userId}`).subscribe({
      next: (user) => {
        const productIds = this.products.map(p => p.id);
        const updatedCart = (user.cart || []).filter(
          (item: any) => !productIds.includes(item.productId)
        );

        this.http.patch(`${this.usersUrl}/${this.userId}`, { cart: updatedCart }).subscribe({
          next: () => {
            this.toast.success("Purchase Confirmed Successfully!");
            this.isProcessing = false;
            this.router.navigate(['/app-cart']); // Navigate to products page or order confirmation
          },
          error: (err) => {
            console.error('Error clearing cart:', err);
            this.toast.success("Purchase confirmed but cart update failed");
            this.isProcessing = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.toast.success("Purchase confirmed but cart update failed");
        this.isProcessing = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}