import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  currentUser: any = null;
  constructor(private authService: AuthService, private router: Router) {
    authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  logout() {
    this.currentUser = null;
    this.router.navigate(['/logout']);
  }
}
