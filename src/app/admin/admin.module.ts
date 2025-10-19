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
// import { AdminModalComponent } from './components/shared/admin-modal/admin-modal.component';
@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    ConfirmDialogComponent,
    StatsCardsComponent,
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