import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CartComponent } from './features/cart/cart.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ProductBuyComponent } from './features/products/product-buy/product-buy.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { OrdersComponent } from './features/orders/orders.component';
import { AuthGuard } from './core/guards/auth.guards';
import { ContactUsComponent } from './features/contact-us/contact-us.component';

const routes: Routes = [
  {
    path: 'app-about',
    component: AboutComponent,
    // data: { title: 'Dominus' }
  },
  {
    path: 'app-login',
    component: LoginComponent,
  },
  { 
    path: 'app-register', 
    component: RegisterComponent },

  {
    path: 'app-home',
    component: HomeComponent,
    // canActivate: [AuthGuard] 

  },
  {
    path: 'app-product-list',
    component: ProductListComponent,
canActivate: [AuthGuard] 
  },
  {
    path: 'app-orders',
    component: OrdersComponent,
canActivate: [AuthGuard] 
  },

  {
    path: 'app-wishlist',
    component: WishlistComponent,
canActivate: [AuthGuard] 
  },
  {
    path: 'app-cart',
    component: CartComponent,
canActivate: [AuthGuard] 
  },
  {
    path: 'app-product-buy',
    component: ProductBuyComponent,
    // canActivate: [AuthGuard] 
canActivate: [AuthGuard] 
  },
  {
    path: 'app-contact-us',
    component: ContactUsComponent,
    // canActivate: [AuthGuard] 
canActivate: [AuthGuard] 
  },
  {
    path: 'app-product-detail/:id',
    component: ProductDetailComponent,
canActivate: [AuthGuard] 
  },
  {
    path: 'app-profile',
    component: ProfileComponent,
canActivate: [AuthGuard] 
  },
  
  { path: '', redirectTo: '/app-login', pathMatch: 'full' },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
