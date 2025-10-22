import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
@NgModule({
  declarations: [
    AdminHeaderComponent,
    AdminSidebarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,



  ],

  exports: [
    AdminHeaderComponent,
    AdminSidebarComponent,
  ],
})
export class AdminSharedModule { }