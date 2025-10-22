import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { LoginComponent } from './features/auth/login/login.component';
// import { RegisterComponent } from './features/auth/register/register.component';
// import { ButtonComponent } from './shared/componants/button/button.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductModule } from './products/product.module';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { PaymentComponent } from './payment/payment.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';
import { OrdersComponent } from './orders/orders.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        
        HomeComponent,
        CartComponent,
        WishlistComponent,
        PaymentComponent,
        
       
        NotFoundComponent,
        AboutComponent,
      
        OrdersComponent,
        ContactUsComponent,
    ],
    imports: [
         CommonModule,
        
        HttpClientModule,
        FormsModule, ProductModule, BrowserAnimationsModule, NgxPaginationModule, AuthModule ,SharedModule
    ],
    exports: [ 
        HomeComponent,
        CartComponent,
        WishlistComponent,
        PaymentComponent,
        NotFoundComponent,
        AboutComponent,
        OrdersComponent,
        ContactUsComponent,
    ]
}
)
export class FeaturesModule { }


