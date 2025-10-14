import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { website_constants } from 'src/app/core/constants/app.constant';
import { Product } from 'src/app/core/models/product.model';
import { WishlistItems } from 'src/app/core/models/wishlistItems.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { WishlistBadgeService } from 'src/app/core/services/wishlistBadge.service';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {

  private usersUrl = website_constants.API.USERURL;
  private productsUrl = website_constants.API.PRODUCTURL;

  WishlistItems: WishlistItems[] = [];
  products: Product[] = [];

  loading: boolean = true;
  userId: string = '';
  product: any;
  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private router: Router,
    private WishlistBadgeService: WishlistBadgeService
  ) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = currentUser?.id || '';

    if (this.userId) {
      this.loadWishlistItems();
    } else {
      this.loading = false;
      console.log('No user logged in');
      this.WishlistBadgeService.updatewishlistCount(0);
    }

  }



  loadWishlistItems() {
    this.loading = true;

    // Fetch user and cart
    this.http
      .get<any>(`${this.usersUrl}/${this.userId}`)
      .pipe(
        switchMap((user) => {
          const WishlistItems: WishlistItems[] = user?.wishlist || [];

          if (WishlistItems.length === 0) {
            this.WishlistBadgeService.updatewishlistCount(0);
            return of([]); // Empty cart
          }

          // Fetch products for each cart item
          const productRequests = WishlistItems.map((WishlistItems) =>
            this.http.get<Product>(`${this.productsUrl}/${WishlistItems.productId}`).pipe(
              map(
                (product) =>
                ({
                  ...WishlistItems,
                  product,
                })
              )
            )
          );

          return forkJoin(productRequests);
        })
      )
      .subscribe({
        next: (wishWithProducts) => {
          this.WishlistItems = wishWithProducts;
          this.WishlistBadgeService.updatewishlistCount(this.WishlistItems.length);
          this.loading = false;
          console.log('🛒 Wishlist loaded:', this.WishlistItems);
        },
        error: (err) => {
          this.loading = false;
          console.error('❌ Error loading cart:', err);
        },
      });
  }
  addToCart(product: Product) {
    const fetchUserData = JSON.parse(localStorage.getItem("currentUser") || '{}');
    if (!fetchUserData.id) {
      console.error("User not logged in");
      this.toast.error("User not logged in")
      return;
    }

    if (product.stock <= 0) {
      console.log('⚠️ Out of stock');
      this.toast.info("⚠️ Out of stock")
      return;
    }
    this.http.get<any>(`http://localhost:3000/users/${fetchUserData.id}`)
      .pipe(
        switchMap((user) => {
          // Check if product already exists in cart
          const existingItem = user.cart?.find((item: any) => item.productId === product.id);

          if (existingItem) {
            console.log('⚠️ Product already in cart');
            this.toast.info("⚠️ Product already in cart")

            return this.http.get<any>(`http://localhost:3000/users/${fetchUserData.id}`);
          }

          const newCartItem = {
            productId: product.id,
            // productName: product.name,
          };
          console.log('Added to cart:', product);
          this.toast.success("Added to Cart")
          const updatedCart = [...(user.cart || []), newCartItem];
          this.WishlistBadgeService.updatewishlistCount(this.WishlistItems.length);

          const updatedWishlist = user.wishlist?.filter((item: any) => item.productId !== product.id);

          return forkJoin([
            this.http.patch(`http://localhost:3000/users/${fetchUserData.id}`, { cart: updatedCart }),
            this.http.patch(`http://localhost:3000/users/${fetchUserData.id}`, { wishlist: updatedWishlist }),
          ]);

        })
      )
      .subscribe({
        next: (res) => { console.log('🛒 Cart updated successfully:', res), this.loadWishlistItems(); },
        error: (err) => console.error('❌ Error updating cart:', err),
      });
  }
  getAddToCartButtonClass(product: Product): string {
    const base = 'px-3 py-2 rounded-full text-sm transition-all duration-200';
    return product.stock === 0
      ? `${base} bg-gray-200 text-gray-400 cursor-not-allowed`
      : `${base} bg-yellow-500 text-black hover:bg-yellow-600`;
  }


  moveToCart(item: WishlistItems) {
    // Simulate move to cart
    this.addToCart(item.product);  // Add to cart first, which also removes from wishlist

    console.log('Moved to cart:', item);
    this.removeFromWishlist(item);
  }
  removeFromWishlist(item: WishlistItems) {
    this.WishlistItems = this.WishlistItems.filter((p) => p.productId !== item.productId);
  }
  clearWishlist() {
    this.WishlistItems = [];
  }
}
