import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Tour } from '../interfaces/tour';

@Injectable({
  providedIn: 'root',
})
export class ToursService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllTours(queryParams?: any) {
    let params = new HttpParams();
    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        params = params.set(key, queryParams[key]);
      });
    }
    return this.http.get(`${this.apiUrl}/tours`, { params });
  }

  getTourById(id: string) {
    return this.http.get(`${this.apiUrl}/tours/${id}`);
  }

  getMyTours() {
    return this.http.get(`${this.apiUrl}/users/myBookings`);
  }

  getToursByFilter(filters: any) {
    let params = new HttpParams();

    if (filters.minPrice)
      params = params.append('price[gte]', filters.minPrice);
    if (filters.maxPrice)
      params = params.append('price[lte]', filters.maxPrice);
    if (filters.ratingsAverage)
      params = params.append('ratingsAverage[gte]', filters.ratingsAverage);
    if (filters.location)
      params = params.append('location.description', filters.location);

    return this.http.get<any>(this.apiUrl, { params });
  }

  createTour(formData: any) {
    return this.http.post(`${this.apiUrl}/tours`, formData);
  }

  updateTour(id: string, formData: any) {
    return this.http.patch(`${this.apiUrl}/tours/${id}`, formData);
  }

  deleteTour(id: string) {
    return this.http.delete(`${this.apiUrl}/tours/${id}`);
  }

  // Statistics
  getTopCheapTours() {
    return this.http.get(`${this.apiUrl}/tours/top-5-cheap`);
  }

  getTourStats() {
    return this.http.get(`${this.apiUrl}/tours/tour-stats`);
  }

  getMonthlyPlan(year: number) {
    return this.http.get(`${this.apiUrl}/tours/monthly-plan/${year}`);
  }

  // Reviews

  getTourReviews(tourId: string) {
    return this.http.get(`${this.apiUrl}/tours/${tourId}/reviews`);
  }

  createReview(tourId: string, review: any) {
    return this.http.post(`${this.apiUrl}/tours/${tourId}/reviews`, review);
  }

  getAllBookings() {
    return this.http.get(`${this.apiUrl}/bookings`);
  }
}
