import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../payment.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  bookingNumber: string = '';
  tripName: string = '';
  bookingDate: Date = new Date();

  constructor(private route: ActivatedRoute, private payment: PaymentService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.bookingNumber =
        params['booking'] || 'BK' + Math.floor(10000 + Math.random() * 90000);
      this.tripName = params['trip'] || 'رحلة سياحية';
    });
  }

  createCheckoutSession() {
    this.payment.createBookingCheckout().subscribe((res) => {});
  }

  // دالة للعودة إلى الصفحة الرئيسية
  goToHome(): void {
    // إعادة توجيه المستخدم إلى الصفحة الرئيسية
    window.location.href = '/';
  }

  // دالة لعرض تفاصيل الحجز
  viewBookingDetails(): void {
    // في التطبيق الحقيقي، سيتم توجيه المستخدم إلى صفحة تفاصيل الحجز
    window.location.href = '/bookings';
  }
}
