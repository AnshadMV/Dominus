import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsiteAssetsService {

  private apiUrl = 'http://localhost:3000/website_assets'; // JSON Server URL

  constructor(private http: HttpClient) {}

  /** Get logo from JSON server */
  getLogo(): Observable<string> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        if (data && data.length) {
          let url = data[0].logo_white || data[0].logo_black || '';
          // Remove "src/" prefix so it can work in browser
          if (url.startsWith('src/')) url = url.replace(/^src\//, '');
          return url;
        }
        return 'assets/images/Dominus_black.png'; // fallback
      }),
      catchError(err => {
        console.error('Failed to load logo', err);
        return of('assets/images/Dominus_black.png'); // fallback
      })
    );
  }
}
