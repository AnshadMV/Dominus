import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Check if user is logged in and has admin role
    if (currentUser && currentUser.role === 'admin') {
      return true;
    } else {
      this.router.navigate(['/app-login']);
      return false;
    }
  }
}