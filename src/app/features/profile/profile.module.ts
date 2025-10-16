import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileEditComponent } from './profile-edit-model/profile-edit.component';
import { PasswordEditComponent } from './password-edit-model/password-edit.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileEditComponent,
    PasswordEditComponent
  ],
  imports: [
    ProfileRoutingModule,CommonModule, FormsModule
  ]
})
export class ProfileModule {}
