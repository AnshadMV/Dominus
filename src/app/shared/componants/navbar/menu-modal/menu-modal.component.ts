import { Component, inject, Input } from '@angular/core';
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
    { label: 'Products', link: './app-product-list' },
    { label: 'Cart', link: '/cart' },
    { label: 'Wishlist', link: '/wishlist' },
    { label: 'About', link: '/app-about' }
  ];

  closeModal() {
    this.isOpen = false;
  }
}
