import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { SearchService } from 'src/app/core/services/navbar_search.service';
import { Product } from 'src/app/core/models/product.model';
import { Category } from 'src/app/core/models/category.model';
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    private productService = inject(ProductService);
    private router = inject(Router);
    private http = inject(HttpClient);
    private toast = inject(ToastService)
    private searchService = inject(SearchService);
    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories: Category[] = [];
    isLoading = true;

    searchTerm: string = '';
    selectedCategory: string = 'all';
    sortBy: string = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';
    showFilters: boolean = false;
    private searchSubscription!: Subscription;

    // filter
    priceRange: [number, number] = [0, 100000];
    minPrice: number = 0;
    maxPrice: number = 1000000;
    selectedColors: string[] = [];
    availableColors: string[] = [];
    showOnlyPopular: boolean = false;
    showOnlyInStock: boolean = false;
    UserDataforChecking = JSON.parse(localStorage.getItem("currentUser") || '{}');

    ngOnInit() {
        this.loadProducts();
        this.loadCategories();
        // Subscribe to global search term changes
        this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
            this.searchTerm = term;
            this.applyFilters();
        });
    }
    ngOnDestroy() {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    loadProducts() {
        this.productService.getProducts().subscribe({
            next: (products) => {
                this.products = products;
                this.filteredProducts = products;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading products:', error);
                this.isLoading = false;
            }
        });
    }
    loadCategories() {
        this.productService.getCategories().subscribe({
            next: (categories) => {
                console.log('Fetched categories:', categories);
                this.categories = categories;
            },
            error: (error) => {
                console.error('Error loading categories:', error);

            }
        });
    }
    initializeFilters(products: Product[]) {
        // Initialize price range
        const prices = products.map(p => p.price);
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
        this.priceRange = [this.minPrice, this.maxPrice];

        // Initialize available colors
        const allColors = products.flatMap(p => p.colors || []);
        this.availableColors = [...new Set(allColors)].filter(color => color).sort();
    }




    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Search term filter
            const matchesSearch = !this.searchTerm ||
                product.name.toLowerCase().includes(this.searchTerm.toLowerCase());

            // Category filter
            const matchesCategory = this.selectedCategory === 'all' ||
                product.category === this.selectedCategory;

            // Price range filter
            const matchesPrice = product.price >= this.priceRange[0] &&
                product.price <= this.priceRange[1];

            // Color filter
            const matchesColor = this.selectedColors.length === 0 ||
                (product.colors && product.colors.some(color =>
                    this.selectedColors.includes(color)));

            // Popular filter
            const matchesPopular = !this.showOnlyPopular || product.topSelling;

            // Stock filter
            const matchesStock = !this.showOnlyInStock || product.stock > 0;

            return matchesSearch && matchesCategory && matchesPrice &&
                matchesColor && matchesPopular && matchesStock;
        });

        this.sortProducts();
    }



    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            let a_Value: any = a[this.sortBy as keyof Product];
            let b_Value: any = b[this.sortBy as keyof Product];
            if (a_Value < b_Value) return this.sortDirection === 'asc' ? -1 : 1;
            if (a_Value > b_Value) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    onSearchChange() { this.applyFilters(); }

    onCategoryChange(categoryId: string) {
        this.selectedCategory = categoryId;
        this.applyFilters();
    }

    onPriceRangeChange() {
        this.applyFilters();
    }

    toggleColorFilter(color: string) {
        const index = this.selectedColors.indexOf(color);
        if (index > -1) {
            this.selectedColors.splice(index, 1);
        } else {
            this.selectedColors.push(color);
        }
        this.applyFilters();
    }

    togglePopularFilter() {
        this.showOnlyPopular = !this.showOnlyPopular;
        this.applyFilters();
    }

    toggleInStockFilter() {
        this.showOnlyInStock = !this.showOnlyInStock;
        this.applyFilters();
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
    }

    onSortChange(sortBy: string) {
        if (this.sortBy === sortBy) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = sortBy;
            this.sortDirection = 'asc';
        }
        this.applyFilters();
    }
    get activeFilterCount(): number {
        let count = 0;
        if (this.selectedCategory !== 'all') count++;
        if (this.priceRange[0] > this.minPrice || this.priceRange[1] < this.maxPrice) count++;
        if (this.selectedColors.length > 0) count++;
        if (this.showOnlyPopular) count++;
        if (this.showOnlyInStock) count++;
        return count;
    }




    // viewProduct(product: Product) {
    //     this.router.navigate(['/product', product.slug || product.id]);
    // }

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
                    if (product.stock <= 0) {
                        console.log('⚠️ Out of stock');
                        this.toast.info("⚠️ Out of stock")

                        return this.http.get<any>(`http://localhost:3000/users/${fetchUserData.id}`);
                    }
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


    viewProduct(product: Product) {
        if (product.stock <= 0) {
            console.log('⚠️ Out of stock');
            return this.toast.info("⚠️ Out of stock")

        } else
            if (!this.UserDataforChecking.id) {
                console.error("User not logged in");
                this.toast.error("User not logged in")

                return;

            }
            else {
                this.router.navigate(['/app-product-buy'], {
                    state: { product: [product] }
                });
            }

        console.log(product)
    }

    viewProductDetail(product: Product) {
        this.router.navigate(['/app-product-detail', product.id]);
    }

    getAddToCartButtonClass(product: Product): string {
        const base = 'px-3 py-2 rounded-full text-sm transition-all duration-200';
        return product.stock === 0
            ? `${base} bg-gray-200 text-gray-400 cursor-not-allowed`
            : `${base} bg-yellow-500 text-black hover:bg-yellow-600`;
    }

    clearFilters() {
        this.searchTerm = '';
        this.selectedCategory = 'all';
        this.priceRange = [this.minPrice, this.maxPrice];
        this.selectedColors = [];
        this.showOnlyPopular = false;
        this.showOnlyInStock = false;
        this.sortBy = 'name';
        this.sortDirection = 'asc';
        this.applyFilters();
    }

}
