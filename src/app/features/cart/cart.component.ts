import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { website_constants } from 'src/app/core/constants/app.constant';
import { CartItem } from 'src/app/core/models/cartItem.model';
import { Product } from 'src/app/core/models/product.model';
import { ProductWithQuantity } from 'src/app/core/models/productwithquantity.model';
import { CartBadgeService } from 'src/app/core/services/cartBadge.service';
import { ToastService } from 'src/app/core/services/toast.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  private usersUrl = website_constants.API.USERURL;
  private productsUrl = website_constants.API.PRODUCTURL;
  products: Product[] = [];
  cartItems: CartItem[] = [];
  userId: string = '';
  loading: boolean = true;
  TotalAmountofAllProduct: number = 0;

  constructor(private http: HttpClient, private toast: ToastService, private router: Router, private cartBadgeService: CartBadgeService) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = currentUser?.id || '';

    if (this.userId) {
      this.loadCartItems();
    } else {
      this.loading = false;
      this.cartBadgeService.updateCartCount(0);
      console.log('No user logged in');
    }
  }

  loadCartItems() {
    this.loading = true;

    // Fetch user and cart
    this.http
      .get<any>(`${this.usersUrl}/${this.userId}`)
      .pipe(
        switchMap((user) => {
          const cartItems: CartItem[] = user?.cart || [];

          if (cartItems.length === 0) {
            this.cartBadgeService.updateCartCount(0);
            return of([]); // Empty cart
          }

          // Add quantity to each cart item
          const cartItemsWithQuantity = cartItems.map((cartItem) => ({
            ...cartItem,
            quantity: cartItem.quantity || 1, // Default to 1 if no quantity exists
          }));

          // Fetch products for each cart item
          const productRequests = cartItemsWithQuantity.map((cartItem) =>
            this.http.get<Product>(`${this.productsUrl}/${cartItem.productId}`).pipe(
              map((product) => ({
                ...cartItem,
                product,
              }))
            )
          );

          return forkJoin(productRequests);
        })
      )
      .subscribe({
        next: (cartWithProducts) => {
          this.cartItems = cartWithProducts;
          this.AmoutCalculator();
          this.cartBadgeService.updateCartCount(this.cartItems.length);

          this.loading = false;
          console.log('🛒 Cart loaded:', this.cartItems);
        },
        error: (err) => {
          this.loading = false;
          console.error(' Error loading cart:', err);
        },
      });
  }



  removeFromCart(productId: string) {
    this.http
      .get<any>(`${this.usersUrl}/${this.userId}`)
      .pipe(
        switchMap((user) => {
          const updatedCart = (user.cart || []).filter(
            (item: CartItem) => item.productId !== productId
          );

          return this.http.patch(`${this.usersUrl}/${this.userId}`, { cart: updatedCart });
        })
      )
      .subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter((item) => item.product.id !== productId);
          this.AmoutCalculator();
          this.cartBadgeService.updateCartCount(this.cartItems.length);
          this.toast.error("Item removed from cart")
        },
        error: (err) =>
          this.toast.success("Item Added to cart")
      });
  }

  AmoutCalculator() {
    this.TotalAmountofAllProduct = this.cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity; // Include quantity in calculation
    }, 0);
  }

  // indivitual product passing
  buyProduct(products: Product) {
    const cartItem = this.cartItems.find(item => item.product.id === products.id);
    const productWithQuantity: ProductWithQuantity = {
      ...products,
      quantity: cartItem?.quantity || 1
    };

    this.router.navigate(['/app-product-buy'], {
      state: { product: [productWithQuantity] }
    });
  }

  // All product passing
  proceedToCheckout() {
    const selectedProducts: ProductWithQuantity[] = this.cartItems.map(item => ({
      ...item.product,
      quantity: item.quantity
    }));

    this.router.navigate(['/app-product-buy'], {
      state: { product: selectedProducts }
    });
  }

  increment(item: CartItem) {
    const newQuantity = item.quantity + 1;
    this.patchQuantity(item.productId, newQuantity);
  }

  decrement(item: CartItem) {
    const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;
    this.patchQuantity(item.productId, newQuantity);
  }

  patchQuantity(productId: string, newQuantity: number) {
    const cartItem = this.cartItems.find(item => item.productId === productId);

    if (cartItem) {
      cartItem.quantity = newQuantity;

      this.http.get<any>(`${this.usersUrl}/${this.userId}`)
        .subscribe({
          next: (user) => {
            const updatedCart = user.cart.map((item: any) => {
              if (item.productId === productId) {
                return {
                  productId: item.productId,
                  quantity: newQuantity
                };
              }
              return item;
            });

            this.http.patch(`${this.usersUrl}/${this.userId}`, {
              cart: updatedCart
            })
              .subscribe({
                next: () => {
                  this.AmoutCalculator();
                  console.log(`Quantity of product ${productId} updated to ${newQuantity}`);
                },
                error: (err) => {
                  console.error(' Error updating quantity:', err);
                },
              });
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });
    }
  }
}