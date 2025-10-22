import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminHeaderComponent } from './shared/admin-header/admin-header.component';
import { AdminSidebarComponent } from './shared/admin-sidebar/admin-sidebar.component';
import { AdminFeatureModule } from './components/admin-feature.module';
import { AdminSharedModule } from './shared/admin-shared.module';

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule,
    FormsModule,

    //Modules - Shared and Feature
    AdminFeatureModule, 
    AdminSharedModule



  ],

})
export class AdminModule { }