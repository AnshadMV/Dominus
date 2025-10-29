import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { AdminAuthService } from 'src/app/core/services/admin-auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  showProfileDropdown = false;
  searchQuery: string = '';

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>(); 

  constructor(
    private authService: AdminAuthService,
    private router: Router,
    private eRef: ElementRef,
    private toast:ToastService
  ) {}

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('currentUser');
    this.showProfileDropdown = false;
    this.router.navigate(['/app-login']);
    console.log("Logout and cleared Data")
    this.toast.error("Logout Succefully")
    this.router.navigate(['/app-login']);
  }

  getAdminUser(): any {
    return this.authService.getAdminUser();
  }

  onSearch(): void {
    // You can perform actual logic here or emit to parent
    console.log('Searching for:', this.searchQuery);
    this.search.emit(this.searchQuery);
  }

  // ⛔ Detect click outside to close dropdown
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showProfileDropdown = false;
    }
  }
}
