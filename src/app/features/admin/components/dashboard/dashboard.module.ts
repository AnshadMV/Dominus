import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        FormsModule,


    ],

    exports: [
DashboardComponent
    ],
})
export class DashBoardModule { }