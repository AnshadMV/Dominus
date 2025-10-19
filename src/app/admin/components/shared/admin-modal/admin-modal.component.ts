import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css']
})
export class AdminModalComponent {
  @Input() isOpen: boolean = false;
  @Input() mode: 'edit' | 'delete' = 'edit'; // Mode to determine edit or delete
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Product>>(); // For edit: emit updated data
  @Output() confirmDelete = new EventEmitter<string>(); // For delete: emit product ID

  editForm: FormGroup;
  categories: any = ''; // To hold category options from server
  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      colors: [[]],
      warranty: [''],
      topSelling: [false],
      isActive: [true],
      // images: [] // Handle images separately if needed (e.g., file upload)
    });
    this.loadCategories();
  }

  ngOnChanges() {
    if (this.isOpen) {
      if (this.mode === 'edit' && this.product) {
        this.editForm.patchValue({
          ...this.product,
          colors: this.product.colors || [],
        });
      } else {
        // For new product or non-edit mode, set default category if categories are loaded
        if (this.categories.length > 0 && !this.editForm.get('category')?.value) {
          this.editForm.patchValue({ category: this.categories[0] }); // Default to first category
        }
      }
    }
  }
  onClose() {
    this.close.emit();
    this.editForm.reset({
      name: '',
      price: 0,
      stock: 0,
      category: '',
      colors: [],
      warranty: '',
      topSelling: false,
      isActive: true,
    });
  }

  onSave() {
    if (this.mode === 'edit' && this.editForm.valid) {
      // Line 60 (Original): this.save.emit(this.editForm.value);
      const formValue = this.editForm.value;
      this.save.emit({
        ...formValue,
        colors: Array.isArray(formValue.colors) ? formValue.colors : formValue.colors.split(',').map((c: string) => c.trim()), // Ensure array
      });
      this.onClose();
    }
  }

  onDelete() {
    if (this.mode === 'delete' && this.product?.id) {
      this.confirmDelete.emit(this.product.id);
      this.onClose();
    }
  }

  // New method to load categories
  private loadCategories() {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(cat => cat.name);
        // Set default category if form is not yet initialized with a value
        if (this.isOpen && !this.editForm.get('category')?.value) {
          this.editForm.patchValue({ category: this.categories[0] });
        }
      },
      error: (err) => console.error('Error loading categories:', err),
    });
  }
}