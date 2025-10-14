// C:\Bridgeon\Basics\angular\firstProject\dominus\src\app\core\services\product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VideoServices } from '../models/homevideoservice.model';

@Injectable({
    providedIn: 'root'
})

export class HomeVideoService {
    private videoServicesUrl = 'http://localhost:3000/VideoServices/';

    constructor(private http: HttpClient) { }


    getVideoServices(): Observable<VideoServices[]> {
        return this.http.get<VideoServices[]>(this.videoServicesUrl);
    }

    getFeaturedVideoServices(limit?: number): Observable<VideoServices[]> {
        const url = limit ? `${this.videoServicesUrl}?_limit=${limit}` : this.videoServicesUrl;
        return this.http.get<VideoServices[]>(url);
    }
}