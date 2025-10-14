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


import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartBadgeService } from 'src/app/core/services/cartBadge.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { WishlistBadgeService } from 'src/app/core/services/wishlistBadge.service';
import { SearchService } from 'src/app/core/services/navbar_search.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isModalOpen = false;
  isMenuOpen = false;
  isScrollingDown = false;
  lastScrollTop = 0;
  isDarkBackground = true;
  showProfileDropdown = false;
  cartItemCount: number = 0;
  wishListItemCount: number = 0;
  searchTerm: string = '';
  ngOnInit() {
    this.cartBadgeService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;

      this.loadCartCount();
    });
    this.WishlistBadgeService.WishlistItemCount$.subscribe(count => {
      this.wishListItemCount = count;
      this.loadwishlistCount();
    }); this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });
  }
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
  loadCartCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id;

    if (userId) {
      this.http.get<any>(`http://localhost:3000/users/${userId}`)
        .subscribe({
          next: (user) => {
            const cartLength = user?.cart?.length || 0;
            this.cartBadgeService.updateCartCount(cartLength);
          },
          error: (err) => {
            console.error('Error loading cart count:', err);
          }
        });
    }
  }
  loadwishlistCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser?.id;

    if (userId) {
      this.http.get<any>(`http://localhost:3000/users/${userId}`)
        .subscribe({
          next: (user) => {
            const wishlistLength = user?.wishlist?.length || 0;
            this.WishlistBadgeService.updatewishlistCount(wishlistLength);
          },
          error: (err) => {
            console.error('Error loading cart count:', err);
          }
        });
    }
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

  constructor(private router: Router, private toast: ToastService, private cartBadgeService: CartBadgeService, private http: HttpClient, private WishlistBadgeService: WishlistBadgeService, private searchService: SearchService) { }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  closeProfileDropdown() {
    this.showProfileDropdown = false;
  }
  naviagteToOrder() {
    this.router.navigate(['/app-orders']);
     this.showProfileDropdown = false;
  }

  handleLogout() {
    // Clear user session/token here
    localStorage.removeItem('currentUser');
    this.showProfileDropdown = false;
    this.router.navigate(['/app-login']);
    console.log("Logout and cleared Data")
    this.toast.error("Logout Succefully")
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showProfileDropdown = false;
    }
  }
  onSearchChange(event: any): void {
    const term = event.target.value;
    this.searchService.setSearchTerm(term);

    // Navigate to product list if not already there and search is active
    if (term.length > 0 && !this.router.url.includes('/app-product-list')) {
      this.router.navigate(['/app-product-list']);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }

}