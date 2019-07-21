import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companies: any = []

  constructor(
    private api: ApiService,
    private toastr: ToastrService) {
    this.getCompanies()
  }

  getCompanies() {
    this.api.getCompanies().subscribe(
      res => {
        this.companies = res
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
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
