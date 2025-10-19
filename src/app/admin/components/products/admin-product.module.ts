import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AdminProductlistComponent } from './admin-productlist/admin-productlist.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductCategoriesComponent } from './admin-product-categories/admin-product-categories.component';
import { AdminProductRoutingModule } from './admin-product-routing.module';
import { AdminModalComponent } from '../shared/admin-modal/admin-modal.component';

@NgModule({
  declarations: [
    AdminProductlistComponent,
    AdminProductFormComponent,
    AdminProductCategoriesComponent,
    AdminModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AdminProductRoutingModule,

  ]
})
export class AdminProductModule { }