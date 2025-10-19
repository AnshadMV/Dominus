import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

@Component({
  selector: 'app-admin-product-categories',
  templateUrl: './admin-product-categories.component.html',
  styleUrls: ['./admin-product-categories.component.css']
})
export class AdminProductCategoriesComponent implements OnInit {
  categories: Category[] = [];
  showCategoryModal = false;
  editingCategory: Category | null = null;
  openMenuId: string | null = null;
  categoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.createCategoryForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    console.log('AdminProductCategoriesComponent initialized');
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      color: ['#3B82F6'],
      icon: ['fa-solid fa-cube'],
      status: ['active']
    });
  }

  loadCategories(): void {
    // Mock data - replace with actual API call
    this.categories = [
      {
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        color: '#3B82F6',
        icon: 'fa-solid fa-laptop',
        productCount: 45,
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Clothing',
        description: 'Fashion and apparel',
        color: '#EF4444',
        icon: 'fa-solid fa-shirt',
        productCount: 78,
        status: 'active',
        createdAt: new Date('2024-01-10')
      },
      {
        id: '3',
        name: 'Books',
        description: 'Books and educational materials',
        color: '#10B981',
        icon: 'fa-solid fa-book',
        productCount: 23,
        status: 'active',
        createdAt: new Date('2024-01-20')
      },
      {
        id: '4',
        name: 'Home & Garden',
        description: 'Home decor and garden supplies',
        color: '#F59E0B',
        icon: 'fa-solid fa-home',
        productCount: 34,
        status: 'inactive',
        createdAt: new Date('2024-01-05')
      },
      {
        id: '5',
        name: 'Sports',
        description: 'Sports equipment and accessories',
        color: '#8B5CF6',
        icon: 'fa-solid fa-dumbbell',
        productCount: 29,
        status: 'active',
        createdAt: new Date('2024-01-25')
      },
      {
        id: '6',
        name: 'Beauty',
        description: 'Cosmetics and personal care',
        color: '#EC4899',
        icon: 'fa-solid fa-spa',
        productCount: 56,
        status: 'active',
        createdAt: new Date('2024-01-18')
      }
    ];
  }

  // Statistics getters
  get totalCategories(): number {
    return this.categories.length;
  }

  get activeCategories(): number {
    return this.categories.filter(cat => cat.status === 'active').length;
  }

  get totalProducts(): number {
    return this.categories.reduce((sum, cat) => sum + cat.productCount, 0);
  }

  get averageProductsPerCategory(): number {
    return this.totalCategories > 0 ? Math.round(this.totalProducts / this.totalCategories) : 0;
  }

  // Category menu methods
  toggleCategoryMenu(categoryId: string): void {
    this.openMenuId = this.openMenuId === categoryId ? null : categoryId;
  }

  @HostListener('document:click')
  closeMenuOnClick(): void {
    this.openMenuId = null;
  }

  // Modal methods
  openAddCategoryModal(): void {
    this.editingCategory = null;
    this.categoryForm.reset({
      color: '#3B82F6',
      icon: 'fa-solid fa-cube',
      status: 'active'
    });
    this.showCategoryModal = true;
  }

  editCategory(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      status: category.status
    });
    this.showCategoryModal = true;
    this.openMenuId = null;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.markCategoryFormTouched();
      return;
    }

    const formValue = this.categoryForm.value;

    if (this.editingCategory) {
      // Update existing category
      const index = this.categories.findIndex(cat => cat.id === this.editingCategory!.id);
      if (index !== -1) {
        this.categories[index] = {
          ...this.categories[index],
          ...formValue
        };
      }
    } else {
      // Create new category
      const newCategory: Category = {
        id: (this.categories.length + 1).toString(),
        ...formValue,
        productCount: 0,
        createdAt: new Date()
      };
      this.categories.push(newCategory);
    }

    this.closeCategoryModal();
    
    // Show success message
    alert(`Category ${this.editingCategory ? 'updated' : 'created'} successfully!`);
  }

  deleteCategory(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      const category = this.categories.find(cat => cat.id === categoryId);
      
      if (category && category.productCount > 0) {
        alert('Cannot delete category with existing products. Please reassign products first.');
        return;
      }

      this.categories = this.categories.filter(cat => cat.id !== categoryId);
      this.openMenuId = null;
      
      alert('Category deleted successfully!');
    }
  }

  markCategoryFormTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }

  // Prevent event propagation for menu clicks
  onMenuClick(event: Event): void {
    event.stopPropagation();
  }
}