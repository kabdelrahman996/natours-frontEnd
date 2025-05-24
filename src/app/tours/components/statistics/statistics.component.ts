import { Component } from '@angular/core';
import { Tour } from '../../interfaces/tour';
import { ToursService } from '../../services/tours.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-statistics',
  standalone: false,
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent {
  topCheapTours: Tour[] = [];
  toursStats: Tour[] = [];
  monthlyPlan: Tour[] = [];
  imgUrl: string = environment.apiUrl + '/tours/';
  tourStats: any[] = [];

  constructor(private toursService: ToursService) {}

  ngOnInit() {
    this.getTopCheapTours();
    this.getToursStats();
    this.getMonthlyPlan(2022);
  }

  getTopCheapTours() {
    this.toursService.getTopCheapTours().subscribe((res: any) => {
      this.topCheapTours = res.data;
      console.log('topCheapTours: ', this.topCheapTours);
    });
  }

  getToursStats() {
    this.toursService.getTourStats().subscribe((res: any) => {
      this.toursStats = res.data;
      console.log('toursStats: ', this.toursStats);
    });
  }

  getMonthlyPlan(year: number) {
    this.toursService.getMonthlyPlan(year).subscribe((res: any) => {
      this.monthlyPlan = res.data;
      console.log('Monthly plan:', this.monthlyPlan);
    });
  }
}
