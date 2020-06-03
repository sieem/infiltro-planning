import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies$: Observable<any>;
  public pricePageVisible$: Promise<boolean> = this.pricePageVisible();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    ) {
  }

  getCompanies(invalidateCache: boolean = false): Observable<any> {
    if (this.companies$ && !invalidateCache) {
      return this.companies$;
    }
    this.companies$ = this.api.getCompanies().pipe(shareReplay(1));
    return this.companies$;
  }

  async companyName(companyId) {
    const companies = await this.getCompanies().toPromise();
    try {
      return companies.find(company => company._id === companyId).name;
    } catch (error) {
      return companyId
    }
  }

  async pricePageVisible(): Promise<boolean> {
    if (!this.auth.loggedIn()) {
      return false;
    }
    const companies = await this.getCompanies().toPromise();
    const user = this.auth.getUserDetails();
    return !!companies.find(company => company._id === user.company);
  }
}
