import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WebsiteAssetsService } from '../services/website-assets.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';

interface User {
  id?: number;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  logoUrl: string = '';
  email = '';
  password = '';
  showPassword: boolean = false;
  private apiUrl = 'http://localhost:3000/users';
  userData: any;
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private assetsService: WebsiteAssetsService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    // Load logo dynamically
    this.assetsService.getLogo().subscribe(url => {
      this.logoUrl = url;
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Validate input
    if (!this.email || !this.password) {
      this.toast.error('Please enter email and password');
      return;
    }

    // Fetch users and verify credentials
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        const user = users.find(u => u.email === this.email && u.password === this.password);

        if (user) {
          this.toast.success('Login successful!');
          const currentUser = {
            id: user.id,
            name: (user as any).name,   // if your User interface doesn't have name yet
            email: user.email,
            password: user.password,
            role: (user as any).role || 'user'
          };
          // for globally acceing currentUser in console.log
          this.userData = {
            id: user.id,
            name: (user as any).name,
            email: user.email,
            password: user.password,
            role: (user as any).role || 'user'
          };
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          console.log('Logged in user:', currentUser);
          console.log('Logged in user:', user);
          this.router.navigate(['/app-home']);
        } else {
          this.toast.error('Invalid email or password!');
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.toast.error('Something went wrong. Try again later.');
      }
    });
    

  }


}
