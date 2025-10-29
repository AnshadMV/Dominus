import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CartComponent } from './features/cart/cart.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
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
    component: RegisterComponent
  },
  {
    path: 'app-home',
    component: HomeComponent,
    // canActivate: [AuthGuard] 

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
    path: 'app-contact-us',
    component: ContactUsComponent,
    // canActivate: [AuthGuard] 
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/product.module').then(m => m.ProductModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'app-profile',
    loadChildren: () =>
      import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },

  { path: '', redirectTo: '/app-home', pathMatch: 'full' },
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
