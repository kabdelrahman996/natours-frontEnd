import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersManagementComponent } from './components/users-management/users-management.component';
import { SharedModule } from '../shared/shared.module';
import { UserDetailsComponent } from './components/user-details/user-details.component';

@NgModule({
  declarations: [UsersManagementComponent, UserDetailsComponent],
  imports: [CommonModule, SharedModule],
})
export class UsersModule {}
