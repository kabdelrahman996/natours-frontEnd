import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToursListComponent } from './components/tours-list/tours-list.component';
import { ToursDetailsComponent } from './components/tours-details/tours-details.component';
import { ToursCardComponent } from './components/tours-card/tours-card.component';
import { ToursFiltersComponent } from './components/tours-filters/tours-filters.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CreateTourComponent } from './components/create-tour/create-tour.component';
import { ToursManagementComponent } from './components/tours-management/tours-management.component';
import { EditTourComponent } from './components/edit-tour/edit-tour.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

@NgModule({
  declarations: [
    ToursListComponent,
    ToursDetailsComponent,
    ToursCardComponent,
    ToursFiltersComponent,
    CreateTourComponent,
    ToursManagementComponent,
    EditTourComponent,
    StatisticsComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  exports: [
    ToursListComponent,
    ToursDetailsComponent,
    ToursCardComponent,
    ToursFiltersComponent,
    CheckoutComponent,
  ],
})
export class ToursModule {}
