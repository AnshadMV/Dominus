import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from './../../../../core/services/product.service';
import { Category } from './../../../../core/models/category.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-admin-product-form',
  templateUrl: './admin-product-form.component.html',
  styleUrls: ['./admin-product-form.component.css']
})
export class AdminProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  productId: string | null = null;
  imagePreviews: string[] = [];
  invalidImageUrls: number[] = []; // Track invalid image URLs

  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toast: ToastService
  ) {
    this.productForm = this.createProductForm();
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    this.loadCategories();

    if (this.isEditMode && this.productId) {
      this.loadProductData(this.productId);
    }

    console.log('AdminProductFormComponent initialized - Mode:', this.isEditMode ? 'Edit' : 'Create');
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      comparePrice: [0],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      status: ['active'],
      topselling: ['no'],
      colors: [[], [Validators.required]],
      warranty: ['']
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toast.error("Error loading categories")
      }
    });
  }

  loadProductData(productId: string): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            status: product.isStock ? 'active' : 'inactive',
            topselling: product.topSelling ? 'yes' : 'no',
            colors: product.colors || [],
            warranty: product.warranty
          });

          this.imagePreviews = product.images || [];
          // Validate existing images when loading product data
          this.validateAllImageUrls();
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.toast.error('Error loading product!');
        alert('Error loading product data');
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    // Check if there are any invalid images
    if (this.invalidImageUrls.length > 0) {
      const proceed = confirm('Some images have invalid URLs. They will not be saved. Do you want to continue?');
      if (!proceed) {
        return;
      }
    }

    this.isSubmitting = true;

    const formData = this.productForm.value;

    // Filter out invalid images before submitting
    const validImages = this.imagePreviews.filter((_, index) => !this.isImageUrlInvalid(index));

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      isStock: formData.status === 'active',
      topSelling: formData.topselling === 'yes',
      colors: formData.colors.split(',').map((color: string) => color.trim()),
      warranty: formData.warranty,
      images: validImages, // Only include valid images
      slug: this.generateSlug(formData.name)
    };

    if (this.isEditMode && this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, { ...productData, id: this.productId }).subscribe({
        next: () => {
          this.handleSuccess('Product updated successfully!');
          this.toast.success('Product updated successfully!');
        },
        error: (error) => {
          this.handleError(error, 'updating');
        }
      });
    } else {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.handleSuccess('Product created successfully!');
          this.toast.success('Product updated successfully!');

        },
        error: (error) => {
          this.handleError(error, 'creating');
        }
      });
    }
  }

  private handleSuccess(message: string): void {
    this.isSubmitting = false;
    this.router.navigate(['/admin/products/list']);
  }

  private handleError(error: any, action: string): void {
    this.isSubmitting = false;
    console.error(`Error ${action} product:`, error);
    alert(`Error ${action} product. Please try again.`);
  }

  onImageSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
      event.target.value = ''; // Reset file input
    }
  }

  addImageByUrl(url: string): void {
    if (!url || url.trim() === '') {
      this.toast.error('Please enter a valid URL!');

      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      this.toast.error('Please enter a valid URL!');
      return;
    }

    // Check for duplicate URLs
    if (this.imagePreviews.includes(url)) {
      this.toast.info('This image URL has already been added!');

      return;
    }

    this.imagePreviews.push(url.trim());

    // Validate the new URL
    this.validateImageUrl(this.imagePreviews.length - 1);
  }

  removeImage(index: number): void {
    // Remove the image from previews
    this.imagePreviews.splice(index, 1);

    // Create a new invalidImageUrls array with updated indices
    const updatedInvalidUrls: number[] = [];

    this.invalidImageUrls.forEach(invalidIndex => {
      if (invalidIndex === index) {
        // Skip the removed index
        return;
      } else if (invalidIndex > index) {
        // Decrement indices that come after the removed one
        updatedInvalidUrls.push(invalidIndex - 1);
      } else {
        // Keep indices that come before the removed one
        updatedInvalidUrls.push(invalidIndex);
      }
    });

    this.invalidImageUrls = updatedInvalidUrls;
  }

  clearAllImages(): void {
    if (this.imagePreviews.length > 0) {
      const confirmClear = confirm('Are you sure you want to remove all images?');
      if (confirmClear) {
        this.imagePreviews = [];
        this.invalidImageUrls = [];
      }
    }
  }

  reorderImages(): void {
    this.imagePreviews = this.imagePreviews
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  markImageAsInvalid(index: number): void {
    if (!this.invalidImageUrls.includes(index)) {
      this.invalidImageUrls.push(index);
    }
  }

  isImageUrlInvalid(index: number): boolean {
    return this.invalidImageUrls.includes(index);
  }

  getImageSourceType(imageUrl: string): string {
    if (imageUrl.startsWith('data:')) {
      return 'Uploaded File';
    } else if (imageUrl.startsWith('blob:')) {
      return 'Blob URL';
    } else {
      return 'External URL';
    }
  }

  private validateImageUrl(index: number): void {
    const imageUrl = this.imagePreviews[index];

    // Skip validation for data URLs (uploaded files)
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Image loaded successfully, remove from invalid list if present
      const invalidIndex = this.invalidImageUrls.indexOf(index);
      if (invalidIndex > -1) {
        this.invalidImageUrls.splice(invalidIndex, 1);
      }
    };
    img.onerror = () => {
      // Image failed to load, mark as invalid
      this.markImageAsInvalid(index);
    };
    img.src = imageUrl;

    // Set timeout to handle very slow or unresponsive URLs
    setTimeout(() => {
      if (!img.complete) {
        this.markImageAsInvalid(index);
      }
    }, 5000);
  }

  private validateAllImageUrls(): void {
    this.imagePreviews.forEach((_, index) => {
      this.validateImageUrl(index);
    });
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // Getters for easy access in template
  get name() { return this.productForm.get('name'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
  get category() { return this.productForm.get('category'); }
  get colors() { return this.productForm.get('colors'); }
}