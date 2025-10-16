import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats = [
    { title: 'Total Sales', value: '$12,426', change: '+12%', icon: 'fa-solid fa-dollar-sign', color: 'bg-green-500' },
    { title: 'Total Orders', value: '1,426', change: '+8%', icon: 'fa-solid fa-shopping-cart', color: 'bg-blue-500' },
    { title: 'Total Customers', value: '3,124', change: '+5%', icon: 'fa-solid fa-users', color: 'bg-purple-500' },
    { title: 'Total Products', value: '856', change: '+2%', icon: 'fa-solid fa-box', color: 'bg-orange-500' }
  ];

  recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$120', status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$89', status: 'Pending' },
    { id: '#ORD-003', customer: 'Bob Johnson', amount: '$156', status: 'Completed' },
    { id: '#ORD-004', customer: 'Alice Brown', amount: '$67', status: 'Processing' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}