import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { first } from 'rxjs/operators';
import { CompanyService } from '../services/company.service';

@Injectable({
  providedIn: 'root'
})
export class PricePageGuard implements CanActivate {
  constructor(
    private router: Router,
    private companyService: CompanyService,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const isPriceAvailable = await this.companyService.pricePageVisibleForCurrentUser$.pipe(first()).toPromise();
    if (isPriceAvailable) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
