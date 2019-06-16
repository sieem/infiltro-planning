import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl: string = environment.apiUrl

  constructor(private http: HttpClient) { }

  addUser(user: FormData) {
    return this.http.post(this.baseUrl + '/add-user', user)
  }

  registerUser(user: FormData) {
    return this.http.post(this.baseUrl + '/register', user)
  }

  getUsers() {
    return this.http.get(this.baseUrl + '/get-users')
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

  removeCompany(companyId: string) {
    return this.http.delete(this.baseUrl + '/remove-company/' + companyId)
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

  removeProject(projectId: string) {
    return this.http.delete(this.baseUrl + '/remove-project/' + projectId)
  }
  
}