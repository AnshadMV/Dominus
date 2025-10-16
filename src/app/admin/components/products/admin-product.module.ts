import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AdminProductlistComponent } from './admin-productlist/admin-productlist.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductCategoriesComponent } from './admin-product-categories/admin-product-categories.component';

const routes: Routes = [
  { path: '', component: AdminProductlistComponent },
  { path: 'new', component: AdminProductFormComponent },
  { path: 'edit/:id', component: AdminProductFormComponent },
  { path: 'categories', component: AdminProductCategoriesComponent }
];

@NgModule({
  declarations: [
    AdminProductlistComponent,
    AdminProductFormComponent,
    AdminProductCategoriesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminProductModule { }