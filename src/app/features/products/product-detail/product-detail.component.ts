import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private http = inject(HttpClient)
  private toast = inject(ToastService);

  product: Product | null = null;
  selectedImageIndex = 0;
  isLoading = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: string) {
    this.productService.getProducts().subscribe({
      next: (products) => {
        const foundProduct = products.find(p => p.id === productId);
        if (foundProduct) {
          this.product = foundProduct;
        } else {
          this.toast.error('Product not found');
          this.router.navigate(['/products']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.toast.error('Error loading product');
        this.isLoading = false;
      }
    });
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  addToCart(product: Product) {
    const fetchUserData = JSON.parse(localStorage.getItem("currentUser") || '{}');
    if (!fetchUserData.id) {
      console.error("User not logged in");
      this.toast.error("User not logged in")

      return;
    }

    console.log('Added to cart:', product);
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
          return this.http.patch(`http://localhost:3000/users/${fetchUserData.id}`, { cart: updatedCart });
        })
      )
      .subscribe({
        next: (res) => console.log('🛒 Cart updated successfully:', res),
        error: (err) => console.error('❌ Error updating cart:', err),
      });
  }

  addTowishlist(product: Product) {
    const fetchUserData = JSON.parse(localStorage.getItem("currentUser") || '{}');
    if (!fetchUserData.id) {
      console.error("User not logged in");
      this.toast.error("User not logged in")

      return;
    }

    console.log('Added to wishlist:', product);
    this.http.get<any>(`http://localhost:3000/users/${fetchUserData.id}`)
      .pipe(
        switchMap((user) => {
          // Check if product already exists in wishlist
          const existingItem = user.wishlist?.find((item: any) => item.productId === product.id);

          if (existingItem) {
            console.log('⚠️ Product already in wishlist');
            this.toast.info("⚠️ Product already in wishlist")

            // Optionally, you could show a toast/notification here
            // Return the current user data without modification
            return this.http.get<any>(`http://localhost:3000/users/${fetchUserData.id}`);
          }

          const newCartItem = {
            productId: product.id,
            // productName: product.name,
          };
          console.log('Added to wishlist:', product);
          this.toast.success("Added to wishlist")

          const updatedCart = [...(user.wishlist || []), newCartItem];
          return this.http.patch(`http://localhost:3000/users/${fetchUserData.id}`, { wishlist: updatedCart });
        })
      )
      .subscribe({
        next: (res) => {
          console.log('🛒 Cart updated successfully:', res),
            this.toast.success("🛒 Cart updated successfully:", res)
        },
        error: (err) => {
          console.error('❌ Error updating cart:', err)
            ,
            this.toast.success("❌ Error updating cart:", err)
        }
      });
  }

  goBack() {
    this.router.navigate(['/app-product-list']);
  }
}