import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-admin-product-categories',
  templateUrl: './admin-product-categories.component.html',
  styleUrls: ['./admin-product-categories.component.css']
})
export class AdminProductCategoriesComponent implements OnInit {
  categories: Category[] = []
  openMenuId: string | null = null;
  showCategoryModal: boolean = false;
  totalCategories: number = 0
  activeCategories: number = 0
  nonactiveCategories: number = 0

  // Modal properties
  isModalOpen: boolean = false;
  modalMode: 'edit' | 'delete' | 'add' = 'add';
  selectedCategory: Category | null = null;

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private http: HttpClient,
    private toast: ToastService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({ // Use categoriesService instead of productService
      next: (categories) => {
        this.categories = categories;
        this.totalCategories = this.categories.length
        this.activeCategories = this.categories.filter((x) => x.status == true).length
        this.nonactiveCategories = this.categories.filter((x) => x.status !== true).length
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toast.error("Error loading categories")
      }
    });
  }

  menuOption(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  openAddCategoryModal() {
    this.modalMode = 'add';
    this.selectedCategory = null;
    this.isModalOpen = true;
  }

  openEditCategoryModal(category: Category) {
    this.modalMode = 'edit';
    this.selectedCategory = { ...category };
    this.isModalOpen = true;
    this.openMenuId = null;
  }

  openDeleteCategoryModal(category: Category) {
    this.modalMode = 'delete';
    this.selectedCategory = { ...category };
    this.isModalOpen = true;
    this.openMenuId = null;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCategory = null;
    this.modalMode = 'add';
  }

  handleSave(categoryData: Partial<Category>) {
    console.log('Saving category:', categoryData); // Debug log
    
    if (this.modalMode === 'add') {
      // Generate a simple ID for new category
      const newCategory = {
        ...categoryData,
        id: this.generateCategoryId(categoryData.name as string)
      };
      
      this.categoriesService.addCategory(newCategory).subscribe({
        next: () => {
          this.toast.success('Category added successfully');
          this.closeModal();
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error adding category:', error);
          this.toast.error('Error adding category');
        }
      });
    } else if (this.modalMode === 'edit' && this.selectedCategory?.id) {
      const updatedCategory = {
        ...categoryData,
        id: this.selectedCategory.id // Ensure ID is preserved
      };
      
      this.categoriesService.updateCategory(this.selectedCategory.id, updatedCategory).subscribe({
        next: () => {
          this.toast.success('Category updated successfully');
          this.closeModal();
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.toast.error('Error updating category');
        }
      });
    }
  }

  handleDelete(categoryId: string) {
    this.categoriesService.deleteCategory(categoryId).subscribe({
      next: () => {
        this.toast.success('Category deleted successfully');
        this.closeModal();
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.toast.error('Error deleting category');
      }
    });
  }

  private generateCategoryId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}