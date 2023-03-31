import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesSubject$ = new BehaviorSubject(null);
  companies$ = this.companiesSubject$.pipe(
    switchMap(() => this.api.getCompanies()),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );
  pricePageVisibleForCurrentUser$: Observable<boolean> = this.pricePageVisibleForCurrentUser();

  currentCompanyOfProject$ = new BehaviorSubject(null);
  clientsOf$ = combineLatest([this.currentCompanyOfProject$, this.companies$]).pipe(
    map(([currentCompanyOfProject, companies]) => companies.filter((c) => c.clientOf === currentCompanyOfProject)),
    shareReplay({ refCount: false, bufferSize: 1 }),
  );

  hasClientsOf$ = this.clientsOf$.pipe(map((clientsOf) => clientsOf.length > 0));


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

  isClientOf(companyId: string): Observable<boolean> {
    return this.companies$.pipe(
      map((companies) => Boolean(companies.find((company) => company._id === companyId)?.clientOf) ?? false),
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
