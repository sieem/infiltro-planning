import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies: any

  constructor(private api: ApiService) {
    this.getCompanies()
  }

  getCompanies() {
    if (!this.companies) {
      this.api.getCompanies().subscribe(
        res => {
          this.companies = res
          return this.companies
        },
        err => console.log(err)
      )
    } else {
      return this.companies
    }
  }
}
