// import { Component, HostListener } from '@angular/core';

// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent {
//   isNavbarCollapsed = true;

//   navLinks = [
//     { path: '', label: 'Home', icon: 'bi bi-house-door' },
//     { path: '/shop', label: 'Shop', icon: 'bi bi-shop' },
//     { path: '/cart', label: 'Cart', icon: 'bi bi-cart' },
//     { path: '/login', label: 'Login', icon: 'bi bi-person' }
//   ];

//   closeNavbar() {
//     this.isNavbarCollapsed = true;
//   }
// }


import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isModalOpen = false;
  isMenuOpen = false;
  isScrollingDown = false;
  lastScrollTop = 0;

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > this.lastScrollTop && st > 50) {
      // scrolling down
      this.isScrollingDown = true;
    } else {
      // scrolling up
      this.isScrollingDown = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }
 showProfileDropdown = false;

  constructor(private router: Router) {}

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  closeProfileDropdown() {
    this.showProfileDropdown = false;
  }

  handleLogout() {
    // Clear user session/token here
    localStorage.removeItem('token');
    this.showProfileDropdown = false;
    this.router.navigate(['/app-login']);
    console.log("Logout and cleared Data")
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showProfileDropdown = false;
    }
  }
}