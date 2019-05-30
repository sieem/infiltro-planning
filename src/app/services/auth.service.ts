import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http:HttpClient, private router: Router) { }

  registerUser(user: any) {
    return this.http.post(this.baseUrl + '/register', user)
  }

  loginUser(user: any) {
    return this.http.post(this.baseUrl + '/login', user)
  }
}
