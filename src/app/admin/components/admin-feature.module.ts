import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashBoardModule } from './dashboard/dashboard.module';
import { UsersComponent } from './users/users.component';
import { AdminOrdersComponent } from './orders/orders.component';

@NgModule({
    declarations: [
        UsersComponent,
        AdminOrdersComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        FormsModule, DashBoardModule
    ],

})
export class AdminFeatureModule { }