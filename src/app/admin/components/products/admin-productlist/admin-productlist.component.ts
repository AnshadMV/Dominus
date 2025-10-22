import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-admin-productlist',
  templateUrl: './admin-productlist.component.html',
  styleUrls: ['./admin-productlist.component.css']
})
export class AdminProductlistComponent implements OnInit {

  products: Product[] = [];
  activeProductsCount: number = 0;
  lowStockCount: number = 0;
  filteredProducts: Product[] = [];

  searchTerm: string = '';

  outOfStockCount: number = 0;

  isEditModalOpen = false;
  isDeleteModalOpen = false;
  selectedProduct: Product | null = null;
  isModalOpen = false;
  modalMode: 'edit' | 'delete' = 'edit';



  constructor(private http: HttpClient, private productService: ProductService) { }



  ngOnInit(): void {
    console.log('AdminProductlistComponent initialized');
    this.getProducts();
  }



  getProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        console.log(products)
        this.calculateCounts();
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }






  filterProducts() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = this.products;
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term) ||
        (product.colors && product.colors.includes(term))
      );
    }
  }
  calculateCounts() {
    this.activeProductsCount = this.products.filter(p => p.isActive).length;
    this.lowStockCount = this.products.filter(p => p.stock >= 0 && p.stock <= 10).length;
    this.outOfStockCount = this.products.filter(p => p.stock === 0).length;
  }


  openModal(mode: 'edit' | 'delete', product: Product) {
    this.selectedProduct = product;
    this.modalMode = mode;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  handleSave(updatedData: Partial<Product>) {
    if (this.selectedProduct?.id) {
      const updatedProduct = { ...this.selectedProduct, ...updatedData };
      this.productService.updateProduct(this.selectedProduct.id, updatedProduct).subscribe({
        next: () => {
          this.closeModal();
          this.getProducts();
        },
        error: (err) => console.error('Error updating product:', err),
      });
    }
  }

  handleDelete(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.closeModal();
        this.getProducts();
      },
      error: (err) => console.error('Error deleting product:', err),
    });
  }
  deleteProduct() {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          this.isDeleteModalOpen = false;
          this.getProducts(); // reload table
        },
        error: (err) => console.error('Error deleting product:', err),
      });
    }
  }

  updateProduct(updatedData: any) {
    if (this.selectedProduct && this.selectedProduct.id) {
      const updatedProduct = { ...this.selectedProduct, ...updatedData };
      this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe({
        next: () => {
          this.isEditModalOpen = false;
          this.getProducts(); // reload table
        },
        error: (err) => console.error('Error updating product:', err),
      });
    }
  }

}