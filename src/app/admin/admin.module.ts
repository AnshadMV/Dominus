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

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    ConfirmDialogComponent,
    StatsCardsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule
  ],  exports: [
    AdminHeaderComponent,
    AdminSidebarComponent
  ]
})
export class AdminModule { }