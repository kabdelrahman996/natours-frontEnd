import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { environment } from '../../../../environments/environment.prod';
import { User } from '../../../auth/interfaces/user';

@Component({
  selector: 'app-users-management',
  standalone: false,
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.css',
})
export class UsersManagementComponent {
  users: User[] = [];
  originalUsers: User[] = []; // for restoring/resetting
  imgUrl = environment.imgUrl + '/users/';
  searchText = '';
  isLoading: boolean = false;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.isLoading = true;
    this.usersService.getAllUsers().subscribe((res: any) => {
      this.users = res.data;
      this.originalUsers = res.data; // keep a backup for local filtering and restoring
      this.isLoading = false;
    });
  }

  onSearch(event: any) {
    const value: string = event?.target?.value ?? this.searchText;
    this.searchText = value;

    if (!value.trim()) {
      // Restore all if search empty
      this.users = [...this.originalUsers];
      return;
    }

    const val = value.trim().toLowerCase();
    this.users = this.originalUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(val) ||
        user.email.toLowerCase().includes(val) ||
        user.role.toLowerCase().includes(val)
    );
  }

  onClearSearch() {
    this.searchText = '';
    this.users = [...this.originalUsers];
  }

  deleteUser(id: any) {
    this.usersService.deleteUser(id).subscribe((res) => {
      alert('User deleted successfully.');
      this.users = this.users.filter((user) => user._id !== id);
    });
  }

  showAlert(message: string) {
    alert(message); // Simple alert for demonstration; replace with a proper UI alert in production
  }
}
