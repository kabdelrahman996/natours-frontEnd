import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  user_image = 'assets/images/user_image.png';
  company_image = 'assets/images/gallery-1.jpg';
}
