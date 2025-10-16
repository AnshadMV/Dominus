import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            // {
            //     path: 'products',
            //     loadChildren: () => import('./components/products/admin-product.module').then(m => m.AdminProductModule)
            // },
            // {
            //     path: 'orders',
            //     loadChildren: () => import('./components/orders/admin-orders.module').then(m => m.AdminOrdersModule)
            // },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }