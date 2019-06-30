import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies: any = []

  constructor(private api: ApiService) {
    this.getCompanies()
  }

  getCompanies() {
    this.api.getCompanies().subscribe(
      res => {
        this.companies = res
      },
      err => console.log(err)
    )
  }

  companyName(companyId) {
    let returnVal = companyId
    this.companies.forEach(company => {
      if (company._id === companyId) {
        returnVal = company.name
      }
    });
    return returnVal
  }
}
