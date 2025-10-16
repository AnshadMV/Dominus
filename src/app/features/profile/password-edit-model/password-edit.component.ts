import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-password-edit',
  templateUrl: './password-edit.component.html',
  styleUrls: ['./password-edit.component.css']
})
export class PasswordEditComponent {
  @Input() user: any = {};
  @Input() visible: boolean = false;
  @Output() closePasswordModal = new EventEmitter<void>();
  @Output() updateUser = new EventEmitter<any>();

  closePassword() {
    this.closePasswordModal.emit();
  }

  saveChanges() {
    this.updateUser.emit(this.user);
    this.closePassword();
  }
}
