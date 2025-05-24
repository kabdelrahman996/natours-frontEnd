import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/users/login`, { email, password });
  }

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/users/signup`, data);
  }

  getMe() {
    return this.http.get(`${this.apiUrl}/users/me`);
  }

  updateMe(data: any) {
    return this.http.patch(`${this.apiUrl}/users/updateMe`, data);
  }

  updateMyPassword(data: any) {
    return this.http.patch(`${this.apiUrl}/users/updateMyPassword`, data);
  }

  logout() {
    // this.http.get(`${this.apiUrl}/users/logout`);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  setCurrentUser(user: any, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private loadUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
}
