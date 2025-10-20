import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { website_constants } from 'src/app/core/constants/app.constant';
import { User } from 'src/app/core/models/user.model';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  nameInvalid = false;
  emailInvalid = false;
  passwordInvalid = false;
  showPassword: any;
  private apiUrl = "http://localhost:3000/users/email";
  constructor(private userService: UserService, private http: HttpClient, private router: Router, private toast: ToastService) { }
  // register.component.ts - Replace the entire onSubmit() method
  onSubmit(form: any) {
    if (form.invalid) {
      this.nameInvalid = form.controls.name?.invalid;
      this.emailInvalid = form.controls.email?.invalid;
      this.passwordInvalid = form.controls.password?.invalid;

      // Reset shake after short delay
      setTimeout(() => {
        this.nameInvalid = this.emailInvalid = this.passwordInvalid = false;
      }, 600);
      console.log("Something error in validations")
      return;
    }

    // First check if email belongs to a blocked user
    this.userService.isUserBlocked(this.email).subscribe({
      next: (isBlocked) => {
        if (isBlocked) {
          this.toast.error("This email address is blocked and cannot be used for registration.");
          return;
        }

        // If not blocked, proceed with registration check
        this.http.get<any[]>('http://localhost:3000/users').subscribe({
          next: (users) => {
            const emailExists = users.some(user => user.email === this.email);

            if (emailExists) {
              this.toast.error("Email already registered");
              console.log("Email already exists")
              return;
            }

            // Create new user
            const newUser: User = {
              name: this.name,
              email: this.email,
              password: this.password,
              createdAt: new Date().toISOString(),
              role: 'user',
              wishlist: [],
              orders: [],
              isBlocked: false // Explicitly set to false for new users
            };

            this.userService.registerUser(newUser).subscribe({
              next: () => {
                this.toast.success("Registration Successful");
                this.router.navigate(['/app-login']);
              },
              error: (error) => {
                this.toast.error("Something went wrong. Please try again.");
                console.error('Registration error:', error);
              }
            });
          },
          error: (err) => {
            this.toast.error("Unable to verify email. Please try again.");
            console.error('Error fetching users:', err);
          }
        });
      },
      error: (err) => {
        this.toast.error("Unable to verify email status. Please try again.");
        console.error('Error checking user status:', err);
      }
    });
  }
}