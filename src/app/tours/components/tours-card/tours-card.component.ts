import { Component, Input } from '@angular/core';
import { Tour } from '../../interfaces/tour';
import { User } from '../../../auth/interfaces/user';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-tours-card',
  standalone: false,
  templateUrl: './tours-card.component.html',
  styleUrl: './tours-card.component.css',
})
export class ToursCardComponent {
  @Input() tour!: Tour;
  @Input() currentUser: User | null = null;
  imageUrl: string = '';

  ngOnInit() {
    this.imageUrl = `${environment.imgUrl}/tours/${this.tour?.imageCover}`;
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  /**
   * Get the display text for difficulty
   */
  getDifficultyText(): string {
    const difficultyMap: { [key: string]: string } = {
      easy: 'سهلة',
      medium: 'متوسطة',
      difficult: 'صعبة',
    };
    return difficultyMap[this.tour.difficulty] || this.tour.difficulty;
  }

  /**
   * Calculate final price with discount
   */
  getFinalPrice(): number {
    if (this.tour.priceDiscount) {
      return this.tour.price - this.tour.priceDiscount;
    }
    return this.tour.price;
  }

  /**
   * Calculate discount percentage
   */
  getDiscountPercentage(): number {
    if (!this.tour.priceDiscount) return 0;
    const percentage = (this.tour.priceDiscount / this.tour.price) * 100;
    return Math.round(percentage);
  }

  /**
   * Check if tour has upcoming dates
   */
  hasUpcomingDate(): boolean {
    if (!this.tour.startDates || this.tour.startDates.length === 0) {
      return false;
    }

    const now = new Date();
    return this.tour.startDates.some((dateStr) => {
      const date = new Date(dateStr);
      return date > now;
    });
  }

  /**
   * Get the next upcoming date
   */
  getNextDate(): Date | null {
    if (!this.tour.startDates || this.tour.startDates.length === 0) {
      return null;
    }

    const now = new Date();
    const futureDates = this.tour.startDates
      .map((dateStr) => new Date(dateStr))
      .filter((date) => date > now)
      .sort((a, b) => a.getTime() - b.getTime());

    return futureDates.length > 0 ? futureDates[0] : null;
  }
}
