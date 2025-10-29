import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AdminProductlistComponent } from './admin-productlist/admin-productlist.component';
import { AdminProductCategoriesComponent } from './admin-product-categories/admin-product-categories.component';
import { AdminProductRoutingModule } from './admin-product-routing.module';
import { AdminModalComponent } from 'src/app/shared/componants/admin-modal/admin-modal.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';

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