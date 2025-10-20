// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Create new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Update user
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Delete user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Register user (keep your existing method)
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  blockUser(id: string, reason: string = ''): Observable<User> {
    const blockData = {
      isBlocked: true,
      blockedAt: new Date().toISOString(),
      blockedReason: reason
    };
    return this.http.patch<User>(`${this.apiUrl}/${id}`, blockData);
  }


  // Add unblock user method
  unblockUser(id: string): Observable<User> {
    const unblockData = {
      isBlocked: false,
      blockedAt: null,
      blockedReason: ''
    };
    return this.http.patch<User>(`${this.apiUrl}/${id}`, unblockData);
  }

  // Check if user is blocked by email
  isUserBlocked(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        const user = users[0];
        return user ? user.isBlocked === true : false;
      })
    );
  }



}

// Remove this line: export { User };