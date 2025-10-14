import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartBadgeService {
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCountSubject.asObservable();

  updateCartCount(count: number) {
    this.cartItemCountSubject.next(count);
  }

  getCartCount(): number {
    return this.cartItemCountSubject.value;
  }
}