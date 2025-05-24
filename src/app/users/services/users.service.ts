import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // For admin
  getAllUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
  getUserById(id: string) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}
