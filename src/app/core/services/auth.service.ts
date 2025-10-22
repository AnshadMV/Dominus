// Modified auth.service.ts with adjusted interval and corrected comment
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { tap, switchMap, take } from 'rxjs/operators';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { website_constants } from '../constants/app.constant';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    private checkInterval = 0; 
    private apiUrl = website_constants.API.PRODUCTURL;
    constructor(
        private http: HttpClient,
        private userService: UserService,
        private router: Router,
        private toast: ToastService
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
        this.currentUser = this.currentUserSubject.asObservable();
        // Start periodic blocked status checks
        this.startBlockedStatusChecks();
    }

    // For start periodic checks
    private startBlockedStatusChecks(): void {
        interval(this.checkInterval).pipe(
            switchMap(() => {
                const user = this.currentUserValue;
                if (user && user.email && user.role !== 'admin') {  // Optional: Skip checks for admins to avoid self-kick
                    return this.userService.isUserBlocked(user.email);
                }
                return [false];
            })
        ).subscribe(isBlocked => {
            if (isBlocked) {
                this.handleUserBlocked();
            }
        });
    }

    // Add this method to handle blocked user
    private handleUserBlocked(): void {
        this.logout();
        this.router.navigate(['/app-login']);
        this.toast.error('Your account has been blocked. Please contact administrator.');
    }

    // Update login method to store email for blocked checks
    login(email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(user => {
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            })
        );
    }

    // Make sure logout method clears everything
    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }


}