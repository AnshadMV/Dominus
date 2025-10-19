import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent {
  @Input() user: any = {};
  @Input() visible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateUser = new EventEmitter<any>();

  close() {
    this.closeModal.emit();
  }

  saveChanges() {
    
    this.updateUser.emit(this.user);
    this.close();
  }
}
