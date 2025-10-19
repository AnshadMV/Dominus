import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { website_constants } from 'src/app/core/constants/app.constant';
import { Order } from 'src/app/core/models/order.model';
import { OrderItem } from 'src/app/core/models/orderItem.model';
import { ShippingDetails } from 'src/app/core/models/shippingDetails.model';
import { ToastService } from 'src/app/core/services/toast.service';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  private usersUrl = website_constants.API.USERURL;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  userId: string = '';
  isLoading: boolean = true;
  selectedOrder: Order | null = null;
  filterStatus: string = 'all';
  showOrders: boolean = false;

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private route:Router
  ) { }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = currentUser?.id || '';

    if (this.userId) {
      this.loadOrders();
    } else {
      this.isLoading = false;
      this.toast.error("Please login to view orders");
    }
  }

  loadOrders(): void {
    this.http.get<any>(`${this.usersUrl}/${this.userId}`).subscribe({
      next: (user) => {
        this.orders = (user.orders || []).reverse(); // Show latest first
        this.filteredOrders = this.orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.toast.error("Failed to load orders");
        this.isLoading = false;
      }
    });
  }

  filterOrders(status: string): void {
    this.filterStatus = status;
    if (status === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': 'fa-clock',
      'confirmed': 'fa-check-circle',
      'shipped': 'fa-truck',
      'delivered': 'fa-box-check',
      'cancelled': 'fa-times-circle'
    };
    return icons[status] || 'fa-circle';
  }

  cancelOrder(order: Order): void {
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      this.toast.error("This order cannot be cancelled");
      return;
    }

    if (confirm(`Are you sure you want to cancel order ${order.orderId}?`)) {
      const updatedOrders = this.orders.map(o =>
        o.id === order.id ? { ...o, status: 'cancelled' as const } : o
      );

      this.http.patch(`${this.usersUrl}/${this.userId}`, { orders: updatedOrders }).subscribe({
        next: () => {
          this.toast.success("Order cancelled successfully");
          this.loadOrders();
          this.selectedOrder = null;
        },
        error: (err) => {
          console.error('Error cancelling order:', err);
          this.toast.error("Failed to cancel order");
        }
      });
    }
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  goBack() {
    this.route.navigate(['/products']);
  }
}