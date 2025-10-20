import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shipping-address-modal',
  templateUrl: './shipping-address-modal.component.html',
  styleUrls: ['./shipping-address-modal.component.css']
})
export class ShippingAddressModalComponent {
  @Input() visible: boolean = false;
  @Input() user: any;
  @Output() closeShippingModal = new EventEmitter<void>();
  @Output() updateUser = new EventEmitter<any>();

  shippingDetails: any = {
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: ''
  };

  ngOnChanges() {
    if (this.user && this.user.shippingDetails) {
      this.shippingDetails = { ...this.user.shippingDetails };
    } else {
      this.resetForm();
    }
  }

  onSubmit() {
    const updatedUser = {
      ...this.user,
      shippingDetails: { ...this.shippingDetails }
    };
    this.updateUser.emit(updatedUser);
    this.closeShippingModal.emit();
  }

  onCancel() {
    this.closeShippingModal.emit();
  }

  private resetForm() {
    this.shippingDetails = {
      fullName: this.user?.name || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: this.user?.email || ''
    };
  }
}