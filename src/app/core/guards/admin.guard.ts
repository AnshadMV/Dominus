import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    console.log('AdminGuard checking user:', currentUser); // Debug log

    if (currentUser && currentUser.role === 'admin') {
      return true;
    } else {
      console.log('Admin access denied - redirecting to login'); // Debug log
      this.router.navigate(['/app-login']);
      return false;
    }
  }
}