import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { SidebarMenuItem } from 'src/app/core/models/admin-models/sideBarMenuItem';
import { AdminAuthService } from 'src/app/core/services/admin-auth.service';


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
        { label: 'Categories', route: '/admin/products/categories', icon: 'fa-solid fa-tags', color: '#fb5705ff' }
      ]
    },
    { label: 'Orders', icon: 'fa-solid fa-chart-pie', route: '/admin/orders', color: '#FBBC05' }, // Yellow
    { label: 'Users', icon: 'fa-solid fa-user-group', route: '/admin/users', color: '#ff321fff' }, // Green
  ];

  expandedItems: Set<string> = new Set();
  private isMobile: boolean = false;

  constructor(private authService: AdminAuthService) {
    this.checkMobileView();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkMobileView();
  }

  checkMobileView(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isCollapsed = true;
      this.toggleSidebar.emit();
    }
  }

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

  onMouseEnter(): void {
    if (!this.isMobile && this.isCollapsed) {
      this.isCollapsed = false;
      this.toggleSidebar.emit();
    }
  }

  onMouseLeave(): void {
    if (!this.isMobile && !this.isCollapsed) {
      this.isCollapsed = true;
      this.toggleSidebar.emit();
    }
  }
  getAdminUser(): any {
    return this.authService.getAdminUser();
  }
}