import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ICompany } from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesSubject$ = new BehaviorSubject(null);
  companies$: Observable<ICompany[]> = this.companiesSubject$.pipe(
    switchMap(() => this.api.getCompanies()),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );
  pricePageVisibleForCurrentUser$: Observable<boolean> = this.pricePageVisibleForCurrentUser();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    ) {}

  refreshCompanies() {
    this.companiesSubject$.next(null);
  }

  companyName(companyId: string): Observable<string> {
    return this.companies$.pipe(
      map((companies) => companies.find((company) => company._id === companyId)?.name ?? companyId),
    );
  }

  pricePageVisibleForCurrentUser(): Observable<boolean> {
    if (!this.auth.loggedIn()) {
      return of(false);
    }
    const user = this.auth.getUserDetails();

    return this.companies$.pipe(
      map((companies) => !!companies.find(company => company._id === user?.company && company.pricePageVisible))
    );
  }
}
