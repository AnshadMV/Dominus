// dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from 'src/app/core/services/product.service';
import { UserService } from 'src/app/core/services/user.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DashboardStats } from '../../modals/dashboardStats';
import { RecentOrder } from '../../modals/recentOrder';
import { ProductAnalysis } from '../../modals/productAnanlysis';
import { SalesData } from '../../modals/salesData';
import { RecentActivity } from '../../modals/recentActivity';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats[] = [];
  recentOrders: RecentOrder[] = [];
  isLoading = true;
  chartData: any = {};
  chartInstances: Chart[] = [];
  private products: any[] = [];
  private allOrders: any[] = [];
  private allUsers: any[] = [];
  productAnalysis: ProductAnalysis = {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    topSellingProducts: 0
  };

  salesData: SalesData = {
    totalRevenue: 0,
    dailyRevenue: 0,
    revenueChange: 0,
    averageOrderValue: 0
  };

  topSellingProducts: any[] = [];
  lowStockProducts: any[] = [];
  recentActivities: RecentActivity[] = [];

  private refreshInterval: any;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.startRealtimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
    this.stopRealtimeUpdates();
  }

  private startRealtimeUpdates(): void {
    this.refreshInterval = setInterval(() => {
      this.loadDashboardData();
    }, 30000); // Refresh every 30 seconds
  }

  private stopRealtimeUpdates(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;

    Promise.all([
      this.loadProductsData(),
      this.loadUsersData(),
      this.loadOrdersData()  // ← Remove loadSalesData() - it's calculated in processOrdersData
    ]).then(() => {
      this.updateStats();
      setTimeout(() => {
        this.initializeCharts();
      }, 500);
      this.isLoading = false;
    }).catch((error) => {
      console.error('Error loading dashboard data:', error);
      this.isLoading = false;
    });
  }

  private loadProductsData(): Promise<void> {
    return new Promise((resolve) => {
      this.productService.getProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.analyzeProducts(products);
          this.identifyTopSellingProducts(products);
          this.identifyLowStockProducts(products);
          resolve();
        },
        error: (error) => {
          console.error('Error loading products:', error);
          resolve();
        }
      });
    });
  }

  private loadUsersData(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getUsers().subscribe({
        next: (users) => {
          this.allUsers = users;
          resolve();
        },
        error: (error) => {
          console.error('Error loading users:', error);
          resolve();
        }
      });
    });
  }

  private loadOrdersData(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any[]>('http://localhost:3000/users').subscribe({
        next: (users) => {
          this.processOrdersData(users);
          resolve();
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          resolve();
        }
      });
    });
  }



  private identifyTopSellingProducts(products: any[]): void {
    this.topSellingProducts = products
      .filter(p => p.topSelling)
      .slice(0, 5)
      .map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 1000) + 100,
        revenue: product.price * (Math.floor(Math.random() * 100) + 10),
        stock: product.stock
      }));
  }

  private identifyLowStockProducts(products: any[]): void {
    this.lowStockProducts = products
      .filter(p => p.stock > 0 && p.stock <= 5)
      .slice(0, 5)
      .map(product => ({
        name: product.name,
        stock: product.stock,
        status: product.stock === 0 ? 'Out of Stock' : 'Low Stock'
      }));
  }

  private processOrdersData(users: any[]): void {
    const allOrders: any[] = [];

    users.forEach(user => {
      if (user.orders && user.orders.length > 0) {
        user.orders.forEach((order: any) => {
          allOrders.push({
            ...order,
            customer: user.name,
            customerEmail: user.email,
            userId: user.id
          });
        });
      }
    });

    this.allOrders = allOrders;

    const sortedOrders = allOrders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 10);

    this.recentOrders = sortedOrders.map(order => ({
      id: order.orderId,
      customer: order.customer,
      amount: order.totalAmount,
      status: order.status,
      date: order.orderDate
    }));

    this.calculateOrderMetrics(allOrders);
    this.generateRecentActivities();
  }

  private calculateOrderMetrics(orders: any[]): void {
    const deliveredOrders = orders.filter(order => order.status === 'delivered');
    const totalRevenue = deliveredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const dailyRevenue = deliveredOrders
      .filter(order => this.isToday(order.orderDate))
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    this.salesData = {
      totalRevenue,
      dailyRevenue,
      revenueChange: this.calculateRevenueChange(orders),
      averageOrderValue: deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0
    };
  }

  private generateRecentActivities(): void {
    const activities: RecentActivity[] = [];
    const now = Date.now();

    // Add recent orders as activities
    const recentOrders = this.allOrders
      .filter(order => order.orderDate) // Only include orders with valid dates
      .sort((a, b) => {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);

    recentOrders.forEach(order => {
      const orderTime = new Date(order.orderDate).getTime();
      if (!isNaN(orderTime)) {
        activities.push({
          action: `New order #${order.orderId} from ${order.customer}`,
          time: this.getTimeAgo(order.orderDate),
          type: 'order',
          timestamp: orderTime
        });
      }
    });

    // Add low stock alerts as activities (these are recent by nature)
    const lowStockAlerts = this.lowStockProducts.slice(0, 2);
    lowStockAlerts.forEach(product => {
      activities.push({
        action: `Low stock alert: ${product.name} (${product.stock} remaining)`,
        time: 'Just now',
        type: 'stock',
        timestamp: now
      });
    });

    // Add user registrations if available
    const recentUsers = this.allUsers
      .filter(user => user.createdAt) // Only include users with valid creation dates
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 2);

    recentUsers.forEach(user => {
      const userTime = new Date(user.createdAt).getTime();
      if (!isNaN(userTime)) {
        activities.push({
          action: `New user registered: ${user.name}`,
          time: this.getTimeAgo(user.createdAt),
          type: 'user',
          timestamp: userTime
        });
      }
    });

    // Sort all activities by timestamp (most recent first)
    this.recentActivities = activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8); // Limit to 8 activities

    // If no activities, add a default message
    if (this.recentActivities.length === 0) {
      this.recentActivities = [{
        action: 'No recent activity',
        time: 'N/A',
        type: 'system',
        timestamp: now
      }];
    }
  }

  private getTimeAgo(dateString: string): string {
    if (!dateString) {
      return 'Recently';
    }

    try {
      // Handle your custom date format
      const dateParts = dateString.split(' at ')[0];
      const date = new Date(dateParts);

      // Rest of the method remains the same...
      if (isNaN(date.getTime())) {
        return 'Recently';
      }

      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      // Handle future dates
      if (seconds < 0) {
        return 'Just now';
      }

      let interval = seconds / 31536000;
      if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
      }

      interval = seconds / 2592000;
      if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      }

      interval = seconds / 86400;
      if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }

      interval = seconds / 3600;
      if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }

      interval = seconds / 60;
      if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      }

      if (seconds < 10) {
        return 'Just now';
      }

      return `${Math.floor(seconds)} seconds ago`;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return 'Recently';
    }
  }



  private calculateRevenueChange(orders: any[]): number {
    const todayRevenue = orders
      .filter(order => order.status === 'delivered' && this.isToday(order.orderDate))
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const yesterdayRevenue = orders
      .filter(order => order.status === 'delivered' && this.isYesterday(order.orderDate))
      .reduce((sum, order) => sum + order.totalAmount, 0);

    if (yesterdayRevenue === 0) {
      return todayRevenue > 0 ? 100 : 0;
    }

    return ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
  }

  private updateStats(): void {
    this.stats = [
      {
        title: 'Total Revenue',
        value: this.formatCurrency(this.salesData.totalRevenue),
        change: `${this.salesData.revenueChange > 0 ? '+' : ''}${this.salesData.revenueChange.toFixed(1)}%`,
        icon: 'fa-solid fa-dollar-sign',
        color: 'bg-green-500',
        description: `Today: ${this.formatCurrency(this.salesData.dailyRevenue)}`
      },
      {
        title: 'Total Orders',
        value: this.allOrders.length,
        change: '+8%',
        icon: 'fa-solid fa-shopping-cart',
        color: 'bg-blue-500',
        description: `Avg. Order: ${this.formatCurrency(this.salesData.averageOrderValue)}`
      },
      {
        title: 'Total Products',
        value: this.productAnalysis.totalProducts,
        change: `${this.productAnalysis.activeProducts} active`,
        icon: 'fa-solid fa-box',
        color: 'bg-purple-500',
        description: `${this.productAnalysis.topSellingProducts} top selling`
      },
      {
        title: 'Stock Alert',
        value: this.productAnalysis.lowStockProducts + this.productAnalysis.outOfStockProducts,
        change: `${this.productAnalysis.outOfStockProducts} out of stock`,
        icon: 'fa-solid fa-exclamation-triangle',
        color: 'bg-orange-500',
        description: `${this.productAnalysis.lowStockProducts} low stock`
      }
    ];
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'confirmed':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStockStatusClass(stock: number): string {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 5) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  private initializeCharts(): void {
    this.destroyCharts();
    this.createSalesChart();
    this.createCategoriesChart();
    this.createStockChart();
    this.createOrderStatusChart();
  }

  private createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (ctx) {
      const dailyRevenue = this.calculateDailyRevenue();
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.getLast7DaysLabels(),
          datasets: [{
            label: 'Daily Revenue (₹)',
            data: dailyRevenue,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Daily Revenue Trend (Last 7 Days)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR'
                    }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '₹' + value.toLocaleString('en-IN');
                }
              }
            }
          }
        }
      });
      this.chartInstances.push(chart);
    }
  }

  private getLast7DaysLabels(): string[] {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (i === 0) {
        days.push('Today');
      } else if (i === 1) {
        days.push('Yesterday');
      } else {
        days.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      }
    }
    return days;
  }

  private calculateDailyRevenue(): number[] {
    const dailyRevenue = new Array(7).fill(0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.allOrders
      .filter(order => order.status === 'delivered' && order.orderDate)
      .forEach(order => {
        try {
          // Parse the custom date format: "October 20, 2025 at 10:16 AM"
          const dateString = order.orderDate;
          const dateParts = dateString.split(' at ')[0]; // Get "October 20, 2025"
          const orderDate = new Date(dateParts);

          if (isNaN(orderDate.getTime())) {
            console.warn('Invalid date format:', dateString);
            return;
          }

          orderDate.setHours(0, 0, 0, 0);

          const dayDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

          if (dayDiff >= 0 && dayDiff < 7) {
            dailyRevenue[6 - dayDiff] += order.totalAmount || 0;
          }
        } catch (error) {
          console.error('Error processing order date:', error, order.orderDate);
        }
      });

    return dailyRevenue;
  }
  private isToday(dateString: string): boolean {
    if (!dateString) return false;

    try {
      const dateParts = dateString.split(' at ')[0];
      const date = new Date(dateParts);
      if (isNaN(date.getTime())) return false;

      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
  }

  private isYesterday(dateString: string): boolean {
    if (!dateString) return false;

    try {
      const dateParts = dateString.split(' at ')[0];
      const date = new Date(dateParts);
      if (isNaN(date.getTime())) return false;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();
    } catch (error) {
      console.error('Error checking if date is yesterday:', error);
      return false;
    }
  }
  private createCategoriesChart(): void {
    const ctx = document.getElementById('categoriesChart') as HTMLCanvasElement;
    if (ctx) {
      const categoryData = this.calculateCategoryDistribution();
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryData.labels,
          datasets: [{
            data: categoryData.values,
            backgroundColor: [
              '#3B82F6',
              '#10B981',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6',
              '#06B6D4',
              '#F97316',
              '#EC4899'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Products by Category',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      });
      this.chartInstances.push(chart);
    }
  }

  private calculateCategoryDistribution(): { labels: string[], values: number[] } {
    const categoryMap = new Map<string, number>();
    this.products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    const labels = Array.from(categoryMap.keys());
    const values = Array.from(categoryMap.values());
    return { labels, values };
  }

  private createStockChart(): void {
    const ctx = document.getElementById('stockChart') as HTMLCanvasElement;
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['In Stock', 'Low Stock', 'Out of Stock'],
          datasets: [{
            label: 'Products',
            data: [
              this.productAnalysis.totalProducts - this.productAnalysis.lowStockProducts - this.productAnalysis.outOfStockProducts,
              this.productAnalysis.lowStockProducts,
              this.productAnalysis.outOfStockProducts
            ],
            backgroundColor: [
              '#10B981',
              '#F59E0B',
              '#EF4444'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Stock Status Overview',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
      this.chartInstances.push(chart);
    }
  }

  private createOrderStatusChart(): void {
    const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    if (ctx) {
      const statusData = this.calculateOrderStatusDistribution();
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: statusData.labels,
          datasets: [{
            data: statusData.values,
            backgroundColor: [
              '#10B981',
              '#3B82F6',
              '#F59E0B',
              '#6B7280',
              '#EF4444'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Order Status Distribution',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      });
      this.chartInstances.push(chart);
    }
  }

  private calculateOrderStatusDistribution(): { labels: string[], values: number[] } {
    const statusMap = new Map<string, number>();
    this.allOrders.forEach(order => {
      const status = order.status || 'pending';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });
    const labels = Array.from(statusMap.keys()).map(status =>
      status.charAt(0).toUpperCase() + status.slice(1)
    );
    const values = Array.from(statusMap.values());
    return { labels, values };
  }

  private destroyCharts(): void {
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances = [];
  }

  private analyzeProducts(products: any[]): void {
    this.productAnalysis = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      lowStockProducts: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      outOfStockProducts: products.filter(p => p.stock === 0).length,
      topSellingProducts: products.filter(p => p.topSelling).length
    };
  }

}