import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { resolve } from 'url';

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
    return new Promise((resolve,reject) => {
      this.api.getCompanies().subscribe(
        res => {
          this.companies = res
          return resolve()
        },
        err => {
          this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
          return reject()
        }
      )
    })
    
  }

  companyName(companyId) {
    for (const company of this.companies) {
      if (company._id === companyId) {
        return company.name
      }
    }

    return companyId
  }

  pricePageVisible(user) {
    for (const company of this.companies) {
      if (company._id === user.company) {
        return company.pricePageVisible
      }
    }
  }
}
