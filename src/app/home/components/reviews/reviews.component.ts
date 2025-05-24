import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  standalone: false,
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent {
  reviews = [
    {
      name: 'أحمد محمد',
      avatar: 'assets/images/avatar-1.jpg',
      text: 'تجربة رائعة مع زُها! الرحلة كانت منظمة بشكل ممتاز والمرشد السياحي كان محترفاً جداً.',
      date: '١٥ يوليو ٢٠٢٣',
    },
    // Add more reviews...
  ];
}
