import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http:HttpClient) { }

  registerUser(user: any) {
    return this.http.post(this.baseUrl + '/register', user)
  }

  loginUser(user: any) {
    return this.http.post(this.baseUrl + '/login', user)
  }

  getPlanningData() {
    return this.http.get(this.baseUrl + '/planning-data')
  }
}
