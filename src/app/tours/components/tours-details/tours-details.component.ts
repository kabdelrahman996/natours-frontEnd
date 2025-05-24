declare var Stripe: any;
import { Component } from '@angular/core';
import { Tour } from '../../interfaces/tour';
import { ActivatedRoute } from '@angular/router';
import { ToursService } from '../../services/tours.service';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../environments/environment.prod';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../../payment.service';

@Component({
  selector: 'app-tours-details',
  standalone: false,
  templateUrl: './tours-details.component.html',
  styleUrl: './tours-details.component.css',
})
export class ToursDetailsComponent {
  tour: Tour | null = null;
  tourReviews: any[] = [];
  reviewForm!: FormGroup;
  showReviewForm: boolean = false;
  currentUser: any = null;
  finalPrice: number | null = null;
  isLoading = false;
  error: string | null = null;
  activeImageIndex = 0;
  imageCover: string = '';
  images: string[] = [];
  guidImageUrl = `${environment.imgUrl}/users/`;
  constructor(
    private route: ActivatedRoute,
    private tourService: ToursService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private fb: FormBuilder
  ) {
    authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
    });
    this.reviewForm = this.fb.group({
      review: ['', Validators.required],
      rating: [5],
    });
  }

  ngOnInit(): void {
    this.loadTourDetails();
  }

  loadTourDetails(): void {
    const tourId = this.route.snapshot.paramMap.get('id');
    if (tourId) {
      this.isLoading = true;
      this.tourService.getTourById(tourId).subscribe({
        next: (response: any) => {
          this.tour = response.data;
          this.tourReviews = response.data.reviews;
          this.imageCover = `${environment.imgUrl}/tours/${response.data.imageCover}`;
          this.images = response.data.images.map(
            (img: any) => `${environment.imgUrl}/tours/${img}`
          );
          this.finalPrice =
            response.data.price - (response.data.priceDiscount ?? 0);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'حدث خطأ في تحميل تفاصيل الرحلة';
          this.isLoading = false;
          console.error('Error loading tour details:', err);
        },
      });
    }
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  /**
   * Translates difficulty level to Arabic
   */
  getDifficultyInArabic(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      easy: 'سهلة',
      medium: 'متوسطة',
      difficult: 'صعبة',
    };
    return difficultyMap[difficulty] || difficulty;
  }

  /**
   * Translates guide role to Arabic
   */
  getGuideRoleInArabic(role: string): string {
    const roleMap: { [key: string]: string } = {
      'lead-guide': 'مرشد رئيسي',
      guide: 'مرشد سياحي',
      intern: 'متدرب',
    };
    return roleMap[role] || role;
  }

  /**
   * Calculate approximate total distance of the tour route
   * This is just an example - in a real app you'd use a proper geospatial calculation
   */
  calculateTotalDistance(): number {
    if (
      !this.tour ||
      !this.tour.locations ||
      this.tour.locations.length === 0
    ) {
      return 0;
    }

    let totalDistance = 0;
    let previousPoint = this.tour.startLocation.coordinates;

    // Calculate distance from start location to first point
    if (this.tour.locations.length > 0) {
      totalDistance += this.calculateDistanceBetweenPoints(
        previousPoint[0],
        previousPoint[1],
        this.tour.locations[0].coordinates[0],
        this.tour.locations[0].coordinates[1]
      );
    }

    // Calculate distances between consecutive locations
    for (let i = 0; i < this.tour.locations.length - 1; i++) {
      const currentPoint = this.tour.locations[i].coordinates;
      const nextPoint = this.tour.locations[i + 1].coordinates;

      totalDistance += this.calculateDistanceBetweenPoints(
        currentPoint[0],
        currentPoint[1],
        nextPoint[0],
        nextPoint[1]
      );
    }

    // Round to nearest whole number
    return Math.round(totalDistance);
  }

  /**
   * Calculate distance between two lat/lng points using the Haversine formula
   * @returns Distance in kilometers
   */
  private calculateDistanceBetweenPoints(
    lng1: number,
    lat1: number,
    lng2: number,
    lat2: number
  ): number {
    // Convert degrees to radians
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance;
  }

  /**
   * Get formatted duration text
   */
  getDurationText(): string {
    if (!this.tour) return '';

    if (this.tour.duration <= 1) {
      return 'يوم واحد';
    } else if (this.tour.duration <= 10) {
      return `${this.tour.duration} أيام`;
    } else {
      return `${this.tour.duration} يوماً`;
    }
  }

  /**
   * Sorts locations by day for display
   */
  getSortedLocations() {
    if (!this.tour || !this.tour.locations) return [];
    return [...this.tour.locations].sort((a, b) => {
      return (a.day || 0) - (b.day || 0);
    });
  }

  /**
   * Check if a location has coordinates
   */
  hasValidCoordinates(location: any): boolean {
    return (
      location &&
      location.coordinates &&
      location.coordinates.length === 2 &&
      !isNaN(location.coordinates[0]) &&
      !isNaN(location.coordinates[1])
    );
  }

  createReview(tourId: string, review: any): void {
    const reviewModel = {
      review: review.review,
      rating: review.rating,
    };

    this.tourService.createReview(tourId, reviewModel).subscribe((res: any) => {
      this.reviewForm.reset();
      this.tourReviews.push(res.data);
      this.hideWriteReviewForm();
    });
  }

  showWriteReviewForm() {
    this.showReviewForm = true;
  }

  hideWriteReviewForm() {
    this.showReviewForm = false;
  }

  booking(tourId: string) {
    this.paymentService.createCheckoutSession(tourId).subscribe(
      async (res: any) => {
        console.log(res);
        const stripe = Stripe(
          'pk_test_51RPoh0CcgMjibhGQGuwnQC32LYkhhSUdG5GqcdAdc6udYRZ4y3kcixqwgyM3VCELZwUcSZtVQIcG4lAn4Lh8DyLZ00ZjeNxCye'
        );
        await stripe.redirectToCheckout({
          sessionId: res.session.id,
        });
      },
      (error) => {
        alert('Payment initiation failed. Please try again.');
      }
    );
  }
}
