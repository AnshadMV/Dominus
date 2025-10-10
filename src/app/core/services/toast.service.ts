import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from './../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);

  toastState$ = this.toastSubject.asObservable();
  private counter = 0;

  constructor() {}

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const toast: Toast = {
      id: ++this.counter,
      message,
      type,
      duration
    };
    this.toasts.push(toast);
    this.toastSubject.next(this.toasts);

    // Auto-remove after duration
    setTimeout(() => this.remove(toast.id), duration);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next(this.toasts);
  }

  // Shortcut helpers
  success(msg: string, duration?: number) {
    this.show(msg, 'success', duration);
  }

  error(msg: string, duration?: number) {
    this.show(msg, 'error', duration);
  }

  info(msg: string, duration?: number) {
    this.show(msg, 'info', duration);
  }

  warning(msg: string, duration?: number) {
    this.show(msg, 'warning', duration);
  }
}
