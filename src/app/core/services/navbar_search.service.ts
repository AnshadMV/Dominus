import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$: Observable<string> = this.searchTermSubject.asObservable();

  private searchActiveSubject = new BehaviorSubject<boolean>(false);
  public searchActive$: Observable<boolean> = this.searchActiveSubject.asObservable();

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
    this.searchActiveSubject.next(term.length > 0);
  }

  getSearchTerm(): string {
    return this.searchTermSubject.value;
  }

  clearSearch(): void {
    this.searchTermSubject.next('');
    this.searchActiveSubject.next(false);
  }

  isSearchActive(): boolean {
    return this.searchActiveSubject.value;
  }
}