import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

const routes: Routes = [
  {
    path: 'app-about',
    component: AboutComponent,
    data: { title: 'This is KickCart' }
  },
  {
    path: 'app-login',
    component: LoginComponent,
  },
  { path: 'app-register', component: RegisterComponent },
  // {
  //   path: 'app-products',
  //   component: Pro,
  //   // canActivate: [AuthGuard]
  // },
  {
    path: 'app-home',
    component: HomeComponent,
    //  children: [
    //   { path: 'featured', component: FeaturedProductsComponent },
    //   { path: 'new', component: NewArrivalsComponent }
    // ]
  },
  {
    path: 'app-product-list',
    component: ProductListComponent,
    //  children: [
    //   { path: 'featured', component: FeaturedProductsComponent },
    //   { path: 'new', component: NewArrivalsComponent }
    // ]
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
