import { Component } from '@angular/core';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isSidebarCollapsed = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  // onFabClick() {
  //   alert('Floating Action Button clicked!');
  //   // Open modal, navigate, or trigger action
  // }

}
