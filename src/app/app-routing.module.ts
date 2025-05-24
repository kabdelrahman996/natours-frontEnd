import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/components/home/home.component';
import { ToursListComponent } from './tours/components/tours-list/tours-list.component';
import { ToursDetailsComponent } from './tours/components/tours-details/tours-details.component';
import { AboutComponent } from './about/components/about/about.component';
import { ContactComponent } from './contact/components/contact/contact.component';
import { LoginComponent } from './auth/components/login/login.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { LogoutComponent } from './auth/components/logout/logout.component';
import { EditProfileComponent } from './profile/components/edit-profile/edit-profile.component';
import { UpdatePasswordComponent } from './auth/components/update-password/update-password.component';
import { CreateTourComponent } from './tours/components/create-tour/create-tour.component';
import { ToursManagementComponent } from './tours/components/tours-management/tours-management.component';
import { EditTourComponent } from './tours/components/edit-tour/edit-tour.component';
import { UsersManagementComponent } from './users/components/users-management/users-management.component';
import { UserDetailsComponent } from './users/components/user-details/user-details.component';
import { StatisticsComponent } from './tours/components/statistics/statistics.component';
import { CheckoutComponent } from './tours/components/checkout/checkout.component';
import { BookedToursComponent } from './profile/components/booked-tours/booked-tours.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tours', component: ToursListComponent },
  { path: 'tours/:id', component: ToursDetailsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'toursManagement', component: ToursManagementComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'createTour', component: CreateTourComponent },
  { path: 'editTour/:id', component: EditTourComponent },
  { path: 'usersManagement', component: UsersManagementComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'me', component: ProfileComponent },
  { path: 'myBookings', component: BookedToursComponent },
  { path: 'updateMe', component: EditProfileComponent },
  { path: 'updatePassword', component: UpdatePasswordComponent },
  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
