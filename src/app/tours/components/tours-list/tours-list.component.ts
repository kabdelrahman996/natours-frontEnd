import { Component } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { Tour } from '../../interfaces/tour';
import { User } from '../../../auth/interfaces/user';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tours-list',
  standalone: false,
  templateUrl: './tours-list.component.html',
  styleUrl: './tours-list.component.css',
})
export class ToursListComponent {
  tours: Tour[] = [];
  isLoading = false;
  error: string | null = null;
  currentUser: User | null = null;

  constructor(
    private toursService: ToursService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    authService.currentUser$.subscribe((user: User) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    // if there's query params, load the tours based on them
    this.loadTours(this.activatedRoute.snapshot.queryParams);
    this.loadTours();
  }

  loadTours(queryParams?: any): void {
    this.isLoading = true;
    this.error = null;

    this.toursService.getAllTours(queryParams).subscribe({
      next: (response: any) => {
        this.tours = response.data;
        this.isLoading = false;
        console.log('Tours loaded successfully:', this.tours);
      },
      error: (err) => {
        console.log(err);
        this.error = 'حدث خطأ في تحميل الرحلات السياحية';
        this.isLoading = false;
        console.error('Error loading tours:', err);
      },
    });
  }

  // onFilterChange(filters: any): void {
  //   this.isLoading = true;
  //   this.error = null;

  //   this.toursService.getToursByFilter(filters).subscribe({
  //     next: (response: any) => {
  //       this.tours = response.data.tours;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'حدث خطأ في تصفية الرحلات السياحية';
  //       this.isLoading = false;
  //       console.error('Error filtering tours:', err);
  //     },
  //   });
  // }

  onSortChange(event: any): void {
    const value = event.target.value;
    let sortedTours = [...this.tours];

    switch (value) {
      case 'price-asc':
        sortedTours.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedTours.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sortedTours.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
    }

    this.tours = sortedTours;
  }

  resetFilters(): void {
    this.loadTours();
  }

  onFilterChange(event: any) {
    console.log(event.target.value);
  }
}
