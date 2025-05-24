import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user';
import { environment } from '../../../../environments/environment.prod';
import { UsersService } from '../../../users/services/users.service';
import { ToursService } from '../../../tours/services/tours.service';
import { Tour } from '../../../tours/interfaces/tour';
import { BookingsService } from '../../../tours/services/bookings.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  currentUser!: User;
  isLoading: boolean = true;
  error: string | null = null;
  baseUrl = `${environment.imgUrl}/users/`;
  isAdmin: boolean = false;
  myTours: Tour[] = []; // Will hold the user's bookings
  myBookings: any[] = [];
  allBookings: any[] = [];
  bookingsLoading: boolean = false; // Flag to show loading state
  imgUrl = environment.imgUrl;
  // Admin data
  users: any[] = [];
  usersCount: number = 0;
  usersLoading: boolean = false;
  totalTours: number = 16; // Dummy data for now
  totalReviews: number = 47; // Dummy data for now

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private toursServices: ToursService,
    private BookingsService: BookingsService
  ) {}

  ngOnInit() {
    this.getCurrentUserData();
    this.getMyBookings();
    this.getAllBookings();
  }

  getCurrentUserData() {
    this.isLoading = true;
    this.error = null;

    this.authService.getMe().subscribe({
      next: (res: any) => {
        this.currentUser = res.data;
        this.isAdmin = this.currentUser.role === 'admin';

        // If user is admin, fetch users data
        if (this.isAdmin) {
          this.loadUsersData();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error =
          'فشل في تحميل بيانات المستخدم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
        this.isLoading = false;
      },
    });
  }

  loadUsersData() {
    this.usersLoading = true;

    this.usersService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || [];
        this.usersCount = this.users.length;
        this.usersLoading = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.usersLoading = false;
        this.isLoading = false;
        // Even if this fails, we still show the profile
      },
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin':
        return 'مدير النظام';
      case 'guide':
        return 'مرشد سياحي';
      case 'lead-guide':
        return 'مرشد رئيسي';
      case 'user':
        return 'مستخدم';
      default:
        return 'مستخدم';
    }
  }

  getRoleShortLabel(role: string): string {
    switch (role) {
      case 'admin':
        return 'مدير';
      case 'guide':
        return 'مرشد';
      case 'lead-guide':
        return 'م.رئيسي';
      case 'user':
        return 'مستخدم';
      default:
        return 'مستخدم';
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'role-admin';
      case 'guide':
        return 'role-guide';
      case 'lead-guide':
        return 'role-lead';
      default:
        return 'role-user';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'admin':
        return 'fa-crown';
      case 'guide':
        return 'fa-map-signs';
      case 'lead-guide':
        return 'fa-compass';
      default:
        return 'fa-user';
    }
  }

  getMyBookings() {
    this.bookingsLoading = true;
    this.BookingsService.getMyBookings().subscribe((res: any) => {
      this.myTours = res.data.tours;
      this.myBookings = res.data.bookings;
      this.bookingsLoading = false;
    });
  }

  getAllBookings() {
    this.bookingsLoading = true;
    this.BookingsService.getAllBookings().subscribe((res: any) => {
      this.allBookings = res.data;
      this.bookingsLoading = false;
    });
  }

  showAlert(message: string) {
    alert(message); // Simple alert for demonstration; replace with a proper UI alert in production
  }
}
