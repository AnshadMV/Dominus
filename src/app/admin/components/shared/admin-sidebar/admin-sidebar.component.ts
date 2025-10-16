import { Component, EventEmitter, Input, Output } from '@angular/core';

interface SidebarMenuItem {
  label: string;
  icon: string;
  route: string;
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

  menuItems: SidebarMenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-gauge',
      route: '/admin/dashboard'
    },
    {
      label: 'Products',
      icon: 'fa-solid fa-box',
      route: '/admin/products',
      children: [
        { label: 'All Products', icon: 'fa-solid fa-list', route: '/admin/products' },
        { label: 'Add New', icon: 'fa-solid fa-plus', route: '/admin/products/new' },
        { label: 'Categories', icon: 'fa-solid fa-tags', route: '/admin/products/categories' }
      ]
    },
    {
      label: 'Orders',
      icon: 'fa-solid fa-shopping-cart',
      route: '/admin/orders'
    },
    {
      label: 'Customers',
      icon: 'fa-solid fa-users',
      route: '/admin/customers'
    },
    {
      label: 'Inventory',
      icon: 'fa-solid fa-warehouse',
      route: '/admin/inventory'
    },
    {
      label: 'Coupons',
      icon: 'fa-solid fa-ticket',
      route: '/admin/coupons'
    },
    {
      label: 'Settings',
      icon: 'fa-solid fa-cog',
      route: '/admin/settings'
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
