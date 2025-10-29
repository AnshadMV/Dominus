import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/core/services/toast.service';
import { Order } from 'src/app/core/models/order.model';
import { AdminOrder } from 'src/app/core/models/admin-models/adminOrder-models';

// Extended interface for admin orders with user info


@Component({
  selector: 'app-admin-orders',
  templateUrl: './orders.component.html',
})

export class AdminOrdersComponent implements OnInit {
  private usersUrl = 'http://localhost:3000/users';

  allOrders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];
  isLoading: boolean = true;
  selectedOrder: AdminOrder | null = null;
  filterStatus: string = 'all';
  searchTerm: string = '';

  // Statistics
  stats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.usersUrl).subscribe({
      next: (users) => {
        // Extract orders from all users and flatten the array
        this.allOrders = users
          .filter(user => user.orders && user.orders.length > 0)
          .flatMap(user =>
            user.orders.map((order: Order) => ({
              ...order,
              userName: user.name,
              userEmail: user.email
            } as AdminOrder))
          )
          .reverse(); // Show latest first

        this.updateStatistics();
        this.filterOrders(this.filterStatus);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.toast.error("Failed to load orders");
        this.isLoading = false;
      }
    });
  }

  updateStatistics(): void {
    this.stats = {
      total: this.allOrders.length,
      pending: this.allOrders.filter(order => order.status === 'pending').length,
      confirmed: this.allOrders.filter(order => order.status === 'confirmed').length,
      shipped: this.allOrders.filter(order => order.status === 'shipped').length,
      delivered: this.allOrders.filter(order => order.status === 'delivered').length,
      cancelled: this.allOrders.filter(order => order.status === 'cancelled').length
    };
  }

  filterOrders(status: string): void {
    this.filterStatus = status;
    let filtered = this.allOrders;

    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredOrders = filtered;
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterOrders(this.filterStatus);
  }

  viewOrderDetails(order: AdminOrder): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(order: AdminOrder, newStatus: Order['status']): void {
    if (order.status === newStatus) return;

    const userUrl = `${this.usersUrl}/${order.userId}`;

    this.http.get<any>(userUrl).subscribe({
      next: (user) => {
        const updatedOrders = user.orders.map((userOrder: Order) =>
          userOrder.id === order.id ? { ...userOrder, status: newStatus } : userOrder
        );

        this.http.patch(userUrl, { orders: updatedOrders }).subscribe({
          next: () => {
            this.toast.success(`Order status updated to ${newStatus}`);
            this.loadAllOrders();
            this.selectedOrder = null;
          },
          error: (err) => {
            console.error('Error updating order status:', err);
            this.toast.error("Failed to update order status");
          }
        });
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.toast.error("Failed to update order status");
      }
    });
  }

  getStatusColor(status: string): string 
  {
    const colors: 
    { [key: string]: string } = 
    {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  getNextStatus(currentStatus: Order['status']): Order['status'] | null {
    const statusFlow: { [key: string]: Order['status'] } = {
      'pending': 'confirmed',
      'confirmed': 'shipped',
      'shipped': 'delivered'
    };
    return statusFlow[currentStatus] || null;
  }

  canUpdateStatus(order: AdminOrder): boolean {
    return order.status !== 'cancelled' && order.status !== 'delivered';
  }

  // Helper method to safely update status
  safeUpdateStatus(order: AdminOrder): void {
    const nextStatus = this.getNextStatus(order.status);
    if (nextStatus) {
      this.updateOrderStatus(order, nextStatus);
    }
  }

  // Add these methods to your component class

  getTotalRevenue(): number {
    return this.allOrders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  getShippedAmount(): number {
    return this.allOrders
      .filter(order => order.status === 'shipped')
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  getPendingAmount(): number {
    return this.allOrders
      .filter(order => order.status === 'pending' || order.status === 'confirmed')
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  getCancelledAmount(): number {
    return this.allOrders
      .filter(order => order.status === 'cancelled')
      .reduce((total, order) => total + order.totalAmount, 0);
  }
}