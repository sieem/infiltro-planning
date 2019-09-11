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

  getUserByResetToken(resetToken: string) {
    return this.http.get(this.baseUrl + '/get-user-by-resettoken/' + resetToken)
  }

  loginUser(user: FormData) {
    return this.http.post(this.baseUrl + '/login', user)
  }

  editUser(user: FormData) {
    return this.http.post(this.baseUrl + '/edit-user/', user)
  }

  removeUser(userId: any) {
    return this.http.delete(this.baseUrl + '/remove-user/' + userId)
  }

  resetUser(user: FormData) {
    return this.http.post(this.baseUrl + '/reset-password', user)
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

  generateProjectId() {
    return this.http.get(this.baseUrl + '/generate-project-id')
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

  batchProjects(formData: any) {
    return this.http.post(this.baseUrl + '/batch-projects', formData)
  }

  sendMail(formData: FormData) {
    return this.http.post(this.baseUrl + '/send-project-mail', formData)
  }
  
}