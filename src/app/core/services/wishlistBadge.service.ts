import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistBadgeService {
  private WishlistItemCountSubject = new BehaviorSubject<number>(0);
  public WishlistItemCount$ = this.WishlistItemCountSubject.asObservable();

  updatewishlistCount(count: number) {
    this.WishlistItemCountSubject.next(count);
  }

  getwishlistCount(): number {
    return this.WishlistItemCountSubject.value;
  }
}