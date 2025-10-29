import { NgModule } from '@angular/core';import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';import { ProductModule } from './features/products/product.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthModule } from './features/auth/auth.module';
import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule, 
    HttpClientModule, 
    FormsModule, BrowserAnimationsModule,  NgxPaginationModule, 
    
    
    CoreModule ,AuthModule, ProductModule, FeaturesModule , SharedModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }


