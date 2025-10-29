import { NgModule } from '@angular/core';
// import { LoginComponent } from './features/auth/login/login.component';
// import { RegisterComponent } from './features/auth/register/register.component';
// import { ButtonComponent } from './shared/componants/button/button.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { CardComponent } from './componants/card/card.component';
import { NavbarComponent } from './componants/navbar/navbar.component';
import { FooterComponent } from './componants/footer/footer.component';
import { TopNavbarComponent } from './componants/navbar/top-navbar/top-navbar.component';
import { MenuModalComponent } from './componants/navbar/menu-modal/menu-modal.component';
import { ToastComponent } from './componants/toast/toast/toast.component';
import { SafeUrlPipe } from './pipes/angular_pipes/safe-url.pipe';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './componants/admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './componants/admin-header/admin-header.component';

@NgModule({
  declarations: [
    
    
    CardComponent,
    NavbarComponent,
    FooterComponent,  
   
    
    TopNavbarComponent,
    MenuModalComponent,
    ToastComponent, 
    SafeUrlPipe, 
    AdminHeaderComponent,
        AdminSidebarComponent,
  ],
  imports: [
    CommonModule,
   RouterModule,
    HttpClientModule, 
    FormsModule, BrowserAnimationsModule,  NgxPaginationModule, 
    
  ],
  exports:[
     CardComponent,
    NavbarComponent,
    FooterComponent,  
    TopNavbarComponent,
    MenuModalComponent,
    ToastComponent, RouterModule, 
    SafeUrlPipe, AdminHeaderComponent,
        AdminSidebarComponent,
  ]
})

export class SharedModule { }


