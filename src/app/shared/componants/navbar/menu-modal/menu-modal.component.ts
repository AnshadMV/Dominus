import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.css']
})
export class MenuModalComponent {
  @Input() isOpen: boolean = false;
  private routes = inject(Router)
  navItems = [
    { label: 'Home', link: '/app-home' },
    { label: 'Products', link: './app-products/product-list' },
    { label: 'Cart', link: '/app-cart' },
    { label: 'Wishlist', link: '/app-wishlist' },
    { label: 'About', link: '/app-about' },
    { label: 'Logout', link: '/app-login' ,  }
  ];
  @Output() handleLogout = new EventEmitter<string>();

  closeModal() {
    this.isOpen = false;
  }
  method(){
    this.handleLogout
    this.isOpen=false
  }
}
