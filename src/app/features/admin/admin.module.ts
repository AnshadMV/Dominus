import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminFeatureModule } from './components/admin-feature.module';
import { SharedModule } from "src/app/shared/shared.module";

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
    AdminFeatureModule,
    SharedModule
  ],
})
export class AdminModule { }