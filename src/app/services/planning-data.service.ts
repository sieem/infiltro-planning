import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningDataService {
  private baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPlanningData() {
    return this.http.get(this.baseUrl + '/planning-data')
  }
}
