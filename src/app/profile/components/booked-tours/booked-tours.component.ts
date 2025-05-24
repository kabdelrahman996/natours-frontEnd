import { Component } from '@angular/core';
import { ToursService } from '../../../tours/services/tours.service';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../../../tours/services/bookings.service';

@Component({
  selector: 'app-booked-tours',
  standalone: false,
  templateUrl: './booked-tours.component.html',
  styleUrl: './booked-tours.component.css',
})
export class BookedToursComponent {
  currentUser!: User;
  bookings: any[] = [];
  allBookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Admin functionality
  isAdmin: boolean = false;
  isAdminView: boolean = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  // Sorting
  sortField: string = 'createdAt';
  sortDirection: string = 'desc';

  // Filtering
  filterStatus: string = 'all'; // 'all', 'paid', 'pending'

  constructor(
    private bookingsService: BookingsService, // Updated to use BookingsService
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCurrentUserData();
  }

  getCurrentUserData() {
    this.isLoading = true;
    this.error = null;

    this.authService.getMe().subscribe({
      next: (res: any) => {
        this.currentUser = res.data;
        this.isAdmin =
          this.currentUser.role === 'admin' ||
          this.currentUser.role === 'lead-guide';

        this.isAdmin ? (this.isAdminView = true) : (this.isAdminView = false);

        this.loadBookings();
      },
      error: (err) => {
        this.error =
          'فشل في تحميل بيانات المستخدم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
        this.isLoading = false;
      },
    });
  }

  loadBookings(): void {
    this.isLoading = true;
    this.error = null;

    if (this.isAdminView && this.isAdmin) {
      // Admin is viewing all bookings
      this.bookingsService.getAllBookings().subscribe({
        next: (response: any) => {
          this.allBookings = response.data;
          this.bookings = this.allBookings;
          this.applyFiltersAndSort();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'حدث خطأ في تحميل الحجوزات';
          this.isLoading = false;
          console.error('Error loading all bookings:', err);
        },
      });
    } else {
      // User is viewing their own bookings
      this.bookingsService.getMyBookings().subscribe({
        next: (response: any) => {
          this.bookings = response.data.bookings; // Updated to match your API response format
          this.applyFiltersAndSort();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'حدث خطأ في تحميل الرحلات المحجوزة';
          this.isLoading = false;
          console.error('Error loading bookings:', err);
        },
      });
    }
  }

  deleteBooking(id: string) {
    this.bookingsService.deleteBooking(id).subscribe((res: any) => {
      this.loadBookings();
    });
  }

  applyFiltersAndSort(): void {
    // Filter bookings
    let result = [...this.bookings];

    if (this.filterStatus !== 'all') {
      const isPaid = this.filterStatus === 'paid';
      result = result.filter((booking) => booking.paid === isPaid);
    }

    // Sort bookings
    result.sort((a, b) => {
      let comparison = 0;

      if (this.sortField === 'createdAt') {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (this.sortField === 'price') {
        comparison = a.price - b.price;
      } else if (this.sortField === 'name') {
        comparison = a.tour.name.localeCompare(b.tour.name);
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredBookings = result;
    this.totalItems = this.filteredBookings.length;
  }

  onSortChange(field: string): void {
    if (this.sortField === field) {
      // Toggle direction if clicking on the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.applyFiltersAndSort();
  }

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.applyFiltersAndSort();
    this.currentPage = 1; // Reset to first page when filtering
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getPaginatedBookings(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBookings.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredBookings.length / this.itemsPerPage);
  }

  getBookingStatusClass(booking: any): string {
    return booking.paid ? 'status-paid' : 'status-pending';
  }

  getBookingStatusText(booking: any): string {
    return booking.paid ? 'مدفوع' : 'قيد الانتظار';
  }
}
