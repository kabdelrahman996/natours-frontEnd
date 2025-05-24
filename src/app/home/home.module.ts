import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { RouterModule } from '@angular/router';
import { TopCheapToursComponent } from './components/top-cheap-tours/top-cheap-tours.component';
import { ToursModule } from '../tours/tours.module';

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    AboutComponent,
    GalleryComponent,
    ReviewsComponent,
    TopCheapToursComponent,
  ],
  imports: [CommonModule, RouterModule, ToursModule],
  exports: [
    HomeComponent,
    HeroComponent,
    AboutComponent,
    GalleryComponent,
    ReviewsComponent,
  ],
})
export class HomeModule {}
