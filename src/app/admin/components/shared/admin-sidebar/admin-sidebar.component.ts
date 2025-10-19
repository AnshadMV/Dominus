import { Component, EventEmitter, Input, Output } from '@angular/core';

interface SidebarMenuItem {
  label: string;
  icon: string;
  color?: string;
  route?: string; 
  children?: SidebarMenuItem[];
}
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

 menuItems = [
  { label: 'Dashboard', icon: 'fa-solid fa-chart-line', route: '/admin/dashboard', color: '#4285F4' }, // Blue
   { 
    label: 'Products', 
    icon: 'fa-solid fa-cube', 
    color: '#34A853',
    children: [
      { label: 'Product List', route: '/admin/products/list', icon: 'fa-solid fa-list', color: '#34A853' },
      { label: 'Add Product', route: '/admin/products/new', icon: 'fa-solid fa-plus', color: '#4285F4' },
      { label: 'Categories', route: '/admin/products/categories', icon: 'fa-solid fa-tags', color: '#FBBC05' }
    ]
  },
  { label: 'Users', icon: 'fa-solid fa-user-group', route: '/admin/users', color: '#34A853' }, // Green
  { label: 'Reports', icon: 'fa-solid fa-file-lines', route: '/admin/reports', color: '#FBBC05' }, // Yellow
  { label: 'Settings', icon: 'fa-solid fa-gear', route: '/admin/settings', color: '#EA4335' }, // Red
  {
    label: 'Analytics', 
    icon: 'fa-solid fa-chart-pie', 
    color: '#4285F4',
    children: [
      { label: 'Overview', route: '/admin/analytics/overview', icon: 'fa-regular fa-circle-dot', color: '#34A853' },
      { label: 'Traffic', route: '/admin/analytics/traffic', icon: 'fa-regular fa-chart-bar', color: '#FBBC05' },
    ]
  }
];


  expandedItems: Set<string> = new Set();

  toggleSubMenu(menuLabel: string): void {
    if (this.expandedItems.has(menuLabel)) {
      this.expandedItems.delete(menuLabel);
    } else {
      this.expandedItems.add(menuLabel);
    }
  }

  hasChildren(menuItem: SidebarMenuItem): boolean {
    return !!menuItem.children && menuItem.children.length > 0;
  }

  isExpanded(menuLabel: string): boolean {
    return this.expandedItems.has(menuLabel);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
