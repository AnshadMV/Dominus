import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { PaymentComponent } from './features/payment/payment.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ButtonComponent } from './shared/componants/button/button.component';
import { CardComponent } from './shared/componants/card/card.component';
import { NavbarComponent } from './shared/componants/navbar/navbar.component';
import { FooterComponent } from './shared/componants/footer/footer.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { AboutComponent } from './features/about/about.component';
import { TopNavbarComponent } from './shared/componants/navbar/top-navbar/top-navbar.component';
import { MenuModalComponent } from './shared/componants/navbar/menu-modal/menu-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from './shared/componants/toast/toast/toast.component';
import { SafeUrlPipe } from './shared/pipes/angular_pipes/safe-url.pipe';
import { ProfileComponent } from './features/profile/profile.component';
import { ProfileEditComponent } from './features/profile/profile-edit-model/profile-edit.component';
import { ProductBuyComponent } from './features/products/product-buy/product-buy.component';
import { OrdersComponent } from './features/orders/orders.component';

@NgModule({
  declarations: [

    AppComponent,
    HomeComponent,
    CartComponent,
    WishlistComponent,
    PaymentComponent,
    ProductListComponent,
    ProductDetailComponent,
    LoginComponent,
    RegisterComponent,
    ButtonComponent,
    CardComponent,
    NavbarComponent,
    FooterComponent,
    NotFoundComponent,
    AboutComponent,
    TopNavbarComponent,
    MenuModalComponent,
    ToastComponent, SafeUrlPipe, ProfileComponent, ProfileEditComponent, ProductBuyComponent, OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, HttpClientModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


