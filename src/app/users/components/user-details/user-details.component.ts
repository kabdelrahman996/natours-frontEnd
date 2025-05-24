import { Component } from '@angular/core';
import { User } from '../../../auth/interfaces/user';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-user-details',
  standalone: false,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent {
  user: User | null = null;
  fName: string = '';
  username: string = '';
  userId: string | null = null;
  imgUrl: string = environment.imgUrl + '/users/';
  isLoading: boolean = false;
  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getUserDetails(this.userId!);
  }

  getUserDetails(userId: string) {
    this.isLoading = true;
    this.usersService.getUserById(userId).subscribe((res: any) => {
      this.user = res.data;
      this.fName = this.user?.name.split(' ')[0] || '';
      this.username = this.user?.email.split('@')[0] || '';
      this.isLoading = false;
    });
  }

  showAlert(message: string) {
    alert(message); // Simple alert for demonstration; replace with a proper UI alert in production
  }
}
