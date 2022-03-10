import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IProject } from '../interfaces/project.interface';
import { Observable } from 'rxjs';
import { ICompany } from '../interfaces/company.interface';
import { IUser } from '../interfaces/user.interface';
import { ITemplate } from '../interfaces/template.interface';
import { IComment } from '../interfaces/comments.interface';
import { IActiveFilter } from '../interfaces/active-filter.interface';

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
    return this.http.get<IUser[]>(this.baseUrl + '/get-users')
  }

  getUser(userId: string) {
    return this.http.get(this.baseUrl + '/get-user/' + userId)
  }

  getUserByResetToken(resetToken: string) {
    return this.http.get<string>(this.baseUrl + '/get-user-by-resettoken/' + resetToken)
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
    return this.http.get<ICompany[]>(this.baseUrl + '/get-companies/')
  }

  saveCompany(company: FormData) {
    return this.http.post(this.baseUrl + '/save-company', company)
  }

  removeCompany(companyId: string) {
    return this.http.delete(this.baseUrl + '/remove-company/' + companyId)
  }

  generateProjectId() {
    return this.http.get<string>(this.baseUrl + '/generate-project-id')
  }

  getProjects(activeFilter: Partial<IActiveFilter>) {
    return this.http.post<IProject[]>(this.baseUrl + '/get-projects', { activeFilter })
  }

  getProject(projectId: string): Observable<IProject> {
    return this.http.get<IProject>(this.baseUrl + '/get-project/' + projectId)
  }

  saveProject(formData: FormData) {
    return this.http.post<IProject>(this.baseUrl + '/save-project', formData)
  }

  removeProject(projectId: string) {
    return this.http.delete(this.baseUrl + '/remove-project/' + projectId)
  }

  duplicateProject(projectId: string) {
    return this.http.post<{ projectId: string }>(this.baseUrl + '/duplicate-project/', { projectId})
  }

  batchProjects(formData: any) {
    return this.http.post(this.baseUrl + '/batch-projects', formData)
  }

  sendMail(formData: FormData) {
    return this.http.post(this.baseUrl + '/send-project-mail', formData)
  }

  getMailTemplates() {
    return this.http.get<ITemplate[]>(this.baseUrl + '/get-mail-templates')
  }

  saveMailTemplate(formData: FormData) {
    return this.http.post(this.baseUrl + '/save-mail-template', formData)
  }

  removeMailTemplate(id: string) {
    return this.http.delete(this.baseUrl + '/remove-mail-template/' + id)
  }

  getComments(projectId: string) {
    return this.http.get<IComment[]>(this.baseUrl + '/get-comments/' + projectId)
  }

  saveComment(projectId: string, comment: FormData) {
    return this.http.post<IComment[]>(this.baseUrl + '/save-comment/' + projectId, comment)
  }

  removeComment(projectId: string, commentId: string) {
    return this.http.delete<IComment[]>(this.baseUrl + '/remove-comment/' + projectId + '/' + commentId)
  }

  getProjectArchive(projectId: string) {
    return this.http.get(this.baseUrl + '/get-archive/' + projectId)
  }

}
