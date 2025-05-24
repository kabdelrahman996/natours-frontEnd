import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createCheckoutSession(tourId: string) {
    return this.http.get<any>(
      `${this.apiUrl}/bookings/checkout-session/${tourId}`
    );
  }

  createBookingCheckout() {
    return this.http.get(`${this.apiUrl}/bookings/checkout`);
  }
}
