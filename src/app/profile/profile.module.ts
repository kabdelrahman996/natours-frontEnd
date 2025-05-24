import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookedToursComponent } from './components/booked-tours/booked-tours.component';

@NgModule({
  declarations: [ProfileComponent, EditProfileComponent, BookedToursComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
  exports: [ProfileComponent, EditProfileComponent, BookedToursComponent],
})
export class ProfileModule {}
