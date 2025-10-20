// C:\Bridgeon\Basics\angular\firstProject\dominus\src\app\core\services\product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { website_constants } from '../constants/app.constant';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';


@Injectable({
    providedIn: 'root'
})
export class CategoriesService {

    private categoryUrl = 'http://localhost:3000/categories';

    constructor(private http: HttpClient) { }


    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.categoryUrl);
    }
    addCategory(category: Partial<Category>): Observable<Category> {
        return this.http.post<Category>(this.categoryUrl, category);
    }
    updateCategory(id: string, category: Partial<Category>): Observable<Category> {
        return this.http.put<Category>(`${this.categoryUrl}/${id}`, category);
    } 
    deleteCategory(id: string): Observable<void> {
        return this.http.delete<void>(`${this.categoryUrl}/${id}`);
    }
}