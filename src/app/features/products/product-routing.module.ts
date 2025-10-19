import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductBuyComponent } from './product-buy/product-buy.component';
import { AuthGuard } from 'src/app/core/guards/auth.guards';

const routes: Routes = [
  {
    path: 'product-list',
    component: ProductListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'product-buy',
    component: ProductBuyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'product-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }