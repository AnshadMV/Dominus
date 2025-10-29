import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminProductlistComponent } from './admin-productlist/admin-productlist.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';
import { AdminProductCategoriesComponent } from './admin-product-categories/admin-product-categories.component';

const routes: Routes = [
    {
        path: '', // This should be the base path for all product routes
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' }, // Redirect to list
            { path: 'list', component: AdminProductlistComponent },
            { path: 'new', component: AdminProductFormComponent },
            { path: 'edit/:id', component: AdminProductFormComponent },
            { path: 'categories', component: AdminProductCategoriesComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminProductRoutingModule { }