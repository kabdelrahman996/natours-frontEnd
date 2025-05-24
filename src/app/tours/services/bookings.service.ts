import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getMyBookings() {
    return this.http.get(`${this.apiUrl}/users/myBookings`);
  }

  getAllBookings() {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  getBookingById(id: string) {
    return this.http.get(`${this.apiUrl}/bookings/${id}`);
  }

  deleteBooking(id: string) {
    return this.http.delete(`${this.apiUrl}/bookings/${id}`);
  }
}
