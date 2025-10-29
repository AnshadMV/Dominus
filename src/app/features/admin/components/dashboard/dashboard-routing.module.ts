import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminGuard } from '../../../../core/guards/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AdminGuard],
        
    },
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }