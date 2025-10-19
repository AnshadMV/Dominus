import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductBuyComponent } from './product-buy/product-buy.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductBuyComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductRoutingModule,
  ],
  exports: [
    ProductListComponent,
    ProductDetailComponent,
    ProductBuyComponent
  ]
})
export class ProductModule { }