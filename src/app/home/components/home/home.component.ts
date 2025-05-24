import { Component } from '@angular/core';
import { Tour } from '../../../tours/interfaces/tour';
import { ToursService } from '../../../tours/services/tours.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tours: Tour[] = [];
  isLoading: boolean = false;

  constructor(private toursService: ToursService) {}

  ngOnInit() {
    this.getTopCheapTours();
  }

  getTopCheapTours() {
    this.isLoading = true;
    this.toursService.getTopCheapTours().subscribe((res: any) => {
      console.log('res', res);
      this.tours = res.data;
      console.log('Top cheap tours:', this.tours);
      this.isLoading = false;
    });
  }
}
