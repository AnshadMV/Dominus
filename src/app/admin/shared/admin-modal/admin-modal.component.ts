import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/core/models/product.model';
import { Category } from 'src/app/core/models/category.model';
import { ProductService } from 'src/app/core/services/product.service';
import { CategoriesService } from 'src/app/core/services/categories.service';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() mode: 'edit' | 'delete' | 'add' = 'edit';
  @Input() entityType: 'product' | 'category' = 'product';
  @Input() product: Product | null = null;
  @Input() category: Category | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() confirmDelete = new EventEmitter<string>();

  editForm: FormGroup;
  categories: string[] = [];
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoriesService: CategoriesService
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],

      //fileds related to Products
      price: [0],
      stock: [0],
      category: [''],
      colors: [[]],
      warranty: [''],
      description: [''],
      topSelling: [false],

      // Category fields
      color: ['#000000'],
      status: [true]
    });
    this.loadCategories();
  }

  ngOnChanges() {
    if (this.isOpen) {
      // Clear all validators first
      this.editForm.get('name')?.setValidators([Validators.required]);
      this.editForm.get('price')?.clearValidators();
      this.editForm.get('stock')?.clearValidators();
      this.editForm.get('category')?.clearValidators();
      this.editForm.get('colors')?.clearValidators();
      this.editForm.get('warranty')?.clearValidators();
      this.editForm.get('description')?.clearValidators();
      this.editForm.get('topSelling')?.clearValidators();
      this.editForm.get('color')?.clearValidators();
      this.editForm.get('status')?.clearValidators();

      if (this.entityType === 'product') {
        // Set validators for product fields
        this.editForm.get('price')?.setValidators([Validators.required, Validators.min(0)]);
        this.editForm.get('stock')?.setValidators([Validators.required, Validators.min(0)]);
        this.editForm.get('category')?.setValidators([Validators.required]);
      } else if (this.entityType === 'category') {
        // Set validators for category fields
        this.editForm.get('color')?.setValidators([Validators.required]);
        this.editForm.get('status')?.setValidators([Validators.required]);
      }

      // Update validators
      this.editForm.get('name')?.updateValueAndValidity();
      this.editForm.get('price')?.updateValueAndValidity();
      this.editForm.get('stock')?.updateValueAndValidity();
      this.editForm.get('category')?.updateValueAndValidity();
      this.editForm.get('colors')?.updateValueAndValidity();
      this.editForm.get('warranty')?.updateValueAndValidity();
      this.editForm.get('description')?.updateValueAndValidity();
      this.editForm.get('topSelling')?.updateValueAndValidity();
      this.editForm.get('color')?.updateValueAndValidity();
      this.editForm.get('status')?.updateValueAndValidity();

      if (this.mode === 'edit' || this.mode === 'add') {
        if (this.entityType === 'product' && this.product) {
          this.editForm.patchValue({
            name: this.product.name,
            price: this.product.price,
            stock: this.product.stock,
            category: this.product.category,
            colors: Array.isArray(this.product.colors) ? this.product.colors.join(', ') : this.product.colors,
            warranty: this.product.warranty,
            description: this.product.description,
            topSelling: this.product.topSelling
          });
          this.imagePreview = null;
        } else if (this.entityType === 'category' && this.category) {
          this.editForm.patchValue({
            name: this.category.name,
            color: this.category.color,
            status: this.category.status
          });
          this.imagePreview = this.category.icon ? this.category.icon : null;
        } else if (this.mode === 'add') {
          // Reset form for new entity
          this.resetForm();
        }
      }
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onSave() {
    if ((this.mode === 'edit' || this.mode === 'add') && this.editForm.valid) {
      const formValue = this.editForm.value;

      if (this.entityType === 'product') {
        const productData = {
          ...formValue,
          colors: typeof formValue.colors === 'string'
            ? formValue.colors.split(',').map((c: string) => c.trim()).filter((c: string) => c !== '')
            : formValue.colors,
        };
        this.save.emit(productData);
      } else {
        // Category data - use existing icon if no new image was selected
        const categoryData = {
          name: formValue.name,
          color: formValue.color,
          // Fix: Handle undefined case properly
          icon: this.imagePreview || (this.category?.icon || ''),
          status: formValue.status
        };
        this.save.emit(categoryData);
      }
      this.onClose();
    } else {
      console.log('Form is invalid:', this.editForm.errors);
      this.markFormGroupTouched();
    }
  }

  onDelete() {
    if (this.mode === 'delete') {
      const id = this.entityType === 'product' ? this.product?.id : this.category?.id;
      if (id) {
        this.confirmDelete.emit(id);
        this.onClose();
      }
    }
  }

  getModalTitle(): string {
    if (this.mode === 'delete') {
      return `Delete ${this.entityType}`;
    }
    return this.mode === 'add' ? `Add New ${this.entityType.charAt(0).toUpperCase() + this.entityType.slice(1)}` : `Edit ${this.entityType}`;
  }

  private resetForm() {
  // Reset form values
  this.editForm.reset({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    colors: [],
    warranty: '',
    description: '',
    topSelling: false,
    color: '#000000',
    status: true
  });

  // Clear all validators
  this.editForm.get('name')?.setValidators([Validators.required]);
  this.editForm.get('price')?.clearValidators();
  this.editForm.get('stock')?.clearValidators();
  this.editForm.get('category')?.clearValidators();
  this.editForm.get('colors')?.clearValidators();
  this.editForm.get('warranty')?.clearValidators();
  this.editForm.get('description')?.clearValidators();
  this.editForm.get('topSelling')?.clearValidators();
  this.editForm.get('color')?.clearValidators();
  this.editForm.get('status')?.clearValidators();

  // Set validators based on entityType
  if (this.entityType === 'product') {
    this.editForm.get('price')?.setValidators([Validators.required, Validators.min(0)]);
    this.editForm.get('stock')?.setValidators([Validators.required, Validators.min(0)]);
    this.editForm.get('category')?.setValidators([Validators.required]);
  } else if (this.entityType === 'category') {
    this.editForm.get('color')?.setValidators([Validators.required]);
    this.editForm.get('status')?.setValidators([Validators.required]);
  }

  // Update validators
  this.editForm.get('name')?.updateValueAndValidity();
  this.editForm.get('price')?.updateValueAndValidity();
  this.editForm.get('stock')?.updateValueAndValidity();
  this.editForm.get('category')?.updateValueAndValidity();
  this.editForm.get('colors')?.updateValueAndValidity();
  this.editForm.get('warranty')?.updateValueAndValidity();
  this.editForm.get('description')?.updateValueAndValidity();
  this.editForm.get('topSelling')?.updateValueAndValidity();
  this.editForm.get('color')?.updateValueAndValidity();
  this.editForm.get('status')?.updateValueAndValidity();

  // Set default category if available for product
  if (this.entityType === 'product' && this.categories.length > 0 && !this.editForm.get('category')?.value) {
    this.editForm.patchValue({ category: this.categories[0] });
  }
  
  this.imagePreview = null;
  this.selectedImageFile = null;
}

  private markFormGroupTouched() {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  private loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(cat => cat.name);
        if (this.isOpen && this.entityType === 'product' && !this.editForm.get('category')?.value) {
          this.editForm.patchValue({ category: this.categories[0] });
        }
      },
      error: (err) => console.error('Error loading categories:', err),
    });
  }
}