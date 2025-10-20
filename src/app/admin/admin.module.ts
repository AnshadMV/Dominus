import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminHeaderComponent } from './components/shared/admin-header/admin-header.component';
import { AdminSidebarComponent } from './components/shared/admin-sidebar/admin-sidebar.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { StatsCardsComponent } from './components/shared/stats-cards/stats-cards.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { UsersComponent } from './components/users/users.component';
import { AdminOrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    ConfirmDialogComponent,
    StatsCardsComponent,
    UsersComponent,
    AdminOrdersComponent,
    // AdminModalComponent,
    // ProductEditModalComponent,
    // ProductDeleteModalComponent, 
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule, MatButtonModule,
    MatIconModule 
  ], exports: [
    AdminHeaderComponent,
    AdminSidebarComponent, 
  ]
})
export class AdminModule { }