import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any;
  userName: string = ''
  userId: string | number = ''
  userEmail: string = ''
  userRole: string = ''
  userPassword: string = ''
  userSignedTime: string = ''
  showModal: boolean = false;
  showPasswordModal: boolean = false;

  constructor(private router: Router, private toast: ToastService) { }
  ngOnInit() {
    const storedData = localStorage.getItem('currentUser')
    console.log(storedData)
    if (!storedData) {
      this.toast.error("No user data Available")
      this.router.navigate(['/app-login'])
      return
    }
    this.userData = JSON.parse(storedData)
    this.userName = this.userData.name || 'Nill';
    this.userId = this.userData.id || 'Nill';
    this.userEmail = this.userData.email || 'Nill';
    this.userRole = this.userData.role || 'Nill';
    this.userPassword = this.userData.password || 'Nill';
    this.userSignedTime = this.userData.signedTime ? new Date(this.userData.signedTime).toLocaleString() : 'Nill';
  }
  openModal() {
    this.showModal = true;
  }
  openPasswordModal() {
    this.showPasswordModal = true
  }
  closeModal() {
    this.showModal = false;
  }
  closePasswordModal() {
    this.showPasswordModal = false
  }
  onUserUpdate(updatedUser: any) {
    // Update localStorage immediately
    this.userData = updatedUser;
    console.log(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    console.log(this.userData)
    // Update local state
    this.userName = updatedUser.name;
    this.userEmail = updatedUser.email;
    this.userPassword = updatedUser.password;
    this.toast.success('Profile updated in localStorage!');

    // Update in db.json via HTTP request
    this.updateUserInDatabase(updatedUser);
  }

  private updateUserInDatabase(updatedUser: any) {
    // Make PUT request to update user in db.json
    fetch(`http://localhost:3000/users/${updatedUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update user in database');
        }
        return response.json();
      })
      .then(updatedUserFromServer => {
        console.log('User updated in database:', updatedUserFromServer);
        this.toast.success('Profile updated successfully in server!');
      })
      .catch(error => {
        console.error('Error updating user in database:', error);
        this.toast.error('Failed to update profile in database');
      });
  }
}