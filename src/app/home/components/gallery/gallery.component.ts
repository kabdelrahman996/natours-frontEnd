import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  standalone: false,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent {
  images = [
    {
      url: 'assets/images/gallery-1.jpg',
      title: 'الأهرامات',
      description: 'عجائب الدنيا السبع',
    },
    {
      url: 'assets/images/gallery-2.jpg',
      title: 'معبد الكرنك',
      description: 'آثار الأقصر',
    },
    // Add more images...
  ];
}
