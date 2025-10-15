import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { User, UserService } from 'src/app/core/services/user.service';

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

  constructor(private userService: UserService, private router: Router, private toast: ToastService) { }

  onSubmit(form: any) {



    if (form.invalid) {
      this.nameInvalid = form.controls.name?.invalid;
      this.emailInvalid = form.controls.email?.invalid;
      this.passwordInvalid = form.controls.password?.invalid;

      // Reset shake after short delay
      setTimeout(() => {
        this.nameInvalid = this.emailInvalid = this.passwordInvalid = false;
      }, 600);
      return;
    }

    const newUser: User = {
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: new Date().toLocaleString(),
      role: 'user',
      // cart:[],
      wishlist: [],
      orders: []

    };

    this.userService.registerUser(newUser).subscribe({
      next: () => {
        this.toast.success("Registration Succesfull")
        this.router.navigate(['/app-login']);
      },
      error: (error) => {
        this.toast.error(" Something went wrong. Please try again.", error)
      }
    });

  }
}
