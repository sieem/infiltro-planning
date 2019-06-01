import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies: any = []

  constructor(private api: ApiService) { }

  getCompanies() {
    this.api.getCompanies().subscribe(
      res => this.companies = res,
      err => console.log(err)
    )
  }
}
