import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private authService: AdminAuthService,
    private router: Router
  ) {}

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/app-login']);
  }

  getAdminUser(): any {
    return this.authService.getAdminUser();
  }
}