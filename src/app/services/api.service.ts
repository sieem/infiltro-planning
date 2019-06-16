import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl: string = environment.apiUrl

  constructor(private http: HttpClient) { }

  registerUser(user: FormData) {
    return this.http.post(this.baseUrl + '/register', user)
  }

  getUser(userId: string) {
    return this.http.get(this.baseUrl + '/get-user/' + userId)
  }

  loginUser(user: FormData) {
    return this.http.post(this.baseUrl + '/login', user)
  }

  getCompanies() {
    return this.http.get(this.baseUrl + '/get-companies/')
  }

  saveCompany(company: FormData) {
    return this.http.post(this.baseUrl + '/save-company', company)
  }

  removeCompany(company: FormData) {
    return this.http.post(this.baseUrl + '/remove-company', company)
  }

  getProjects() {
    return this.http.get(this.baseUrl + '/get-projects')
  }

  getProject(projectId: string) {
    return this.http.get(this.baseUrl + '/get-project/' + projectId)
  }

  saveProject(formData: FormData) {
    return this.http.post(this.baseUrl + '/save-project', formData)
  }
}