import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { AdminOrdersComponent } from './components/orders/orders.component';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'products', // This is where the products path should be defined
                loadChildren: () => import('./components/products/admin-product.module').then(m => m.AdminProductModule)
            },
            {
                path: 'users', 
               component: UsersComponent
            },
            {
                path: 'orders', 
               component: AdminOrdersComponent
            },
            // {
            //     path: 'orders',
            //     loadChildren: () => import('./components/orders/admin-orders.module').then(m => m.AdminOrdersModule)
            // },

        ]
    },
    // {
    //     path: '**',
    //     component: AdminNotFoundComponent,
        
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }