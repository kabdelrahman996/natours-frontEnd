import { Component } from '@angular/core';
import { Tour } from '../../interfaces/tour';
import { ToursService } from '../../services/tours.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-tours-management',
  standalone: false,
  templateUrl: './tours-management.component.html',
  styleUrl: './tours-management.component.css',
})
export class ToursManagementComponent {
  imageUrl: string = environment.imgUrl;
  tours: Tour[] = [];
  loading: boolean = false;
  filterOptions = {
    minPrice: '',
    maxPrice: '',
    ratingsAverage: '',
    location: '',
  };

  constructor(private toursService: ToursService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.loading = true;
    this.toursService.getAllTours().subscribe({
      next: (response: any) => {
        this.tours = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في تحميل الرحلات:', error);
        this.loading = false;
      },
    });
  }

  getDifficultyInArabic(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      easy: 'سهل',
      medium: 'متوسط',
      difficult: 'صعب',
    };
    return difficultyMap[difficulty] || difficulty;
  }

  getDifficultyBadgeClass(difficulty: string): string {
    const classMap: { [key: string]: string } = {
      easy: 'bg-success',
      medium: 'bg-warning',
      difficult: 'bg-danger',
    };
    return classMap[difficulty] || 'bg-secondary';
  }

  deleteTour(id: string): void {
    if (confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      this.toursService.deleteTour(id).subscribe({
        next: () => {
          this.tours = this.tours.filter((tour) => tour._id !== id);
        },
        error: (error) => console.error('خطأ في حذف الرحلة:', error),
      });
    }
  }

  applyFilters(): void {
    this.toursService.getToursByFilter(this.filterOptions).subscribe({
      next: (response: any) => {
        this.tours = response.data;
      },
      error: (error) => console.error('خطأ في تطبيق الفلترة:', error),
    });
  }
}
