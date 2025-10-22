// users.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchTerm = '';
  showBlockModal = false;
  blockReason = '';
  userToBlock: User | null = null;


  // Modal states
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Selected user for edit/delete
  selectedUser: User | null = null;

  // New user form data
  newUser: Partial<User> = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    createdAt: new Date().toISOString(),
    wishlist: [],
    orders: []
  };

  constructor(private userService: UserService, private toast: ToastService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  // Search functionality
  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  // Add User
  openAddModal(): void {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      role: 'user',
      createdAt: new Date().toISOString(),
      wishlist: [],
      orders: []
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.newUser = {};
  }

  addUser(): void {
    if (this.isValidUser(this.newUser)) {
      this.userService.createUser(this.newUser as User).subscribe({
        next: (user) => {
          this.users.push(user);
          this.filteredUsers = [...this.users];
          this.closeAddModal();
        },
        error: (error) => {
          console.error('Error adding user:', error);
          alert('Error adding user. Please try again.');
        }
      });
    }
  }

  // Edit User
  openEditModal(user: User): void {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  updateUser(): void {
    if (this.selectedUser && this.selectedUser.id) {
      this.userService.updateUser(this.selectedUser.id.toString(), this.selectedUser).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.filteredUsers = [...this.users];
          }
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Error updating user. Please try again.');
        }
      });
    }
  }

  // Delete User
  openDeleteModal(user: User): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }
  openBlockModal(user: User): void {
    this.userToBlock = user;
    this.blockReason = '';
    this.showBlockModal = true;
  }

  closeBlockModal(): void {
    this.showBlockModal = false;
    this.userToBlock = null;
    this.blockReason = '';
  }
  confirmDelete(): void {
    if (this.selectedUser && this.selectedUser.id) {
      this.userService.deleteUser(this.selectedUser.id.toString()).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== this.selectedUser?.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== this.selectedUser?.id);
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Error deleting user. Please try again.');
        }
      });
    }
  }
  // In users.component.ts - UPDATE confirmBlock method
  confirmBlock(): void {
    if (this.userToBlock && this.userToBlock.id) {
      this.userService.blockUser(this.userToBlock.id.toString(), this.blockReason).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.filteredUsers = [...this.users];
          }
          this.toast.success('User blocked successfully');
          this.closeBlockModal();

          // The blocked user will be automatically logged out immediately
          // through the auth service and interceptor
        },
        error: (error) => {
          console.error('Error blocking user:', error);
          this.toast.error('Error blocking user');
          this.closeBlockModal();
        }
      });
    }
  }


  // Utility function to validate user data
  private isValidUser(user: Partial<User>): boolean {
    return !!(user.name && user.email && user.password && user.role);
  }

  // Get role badge class
  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }


  unblockUser(user: User): void {
    this.userService.unblockUser(user.id!.toString()).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.filteredUsers = [...this.users];
        }
        this.toast.success('User unblocked successfully');
      },
      error: (error) => {
        console.error('Error unblocking user:', error);
        this.toast.error('Error unblocking user');
      }
    });
  }

  // Add this method to get block status badge
  getBlockStatusBadgeClass(isBlocked: boolean): string {
    return isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  }
}