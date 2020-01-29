import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CompanyService } from '../services/company.service';

@Injectable({
  providedIn: 'root'
})
export class PricePageGuard implements CanActivate {
  constructor(
    private auth:AuthService,
    private router: Router,
    private companyService: CompanyService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.companyService.pricePageVisible(this.auth.getUserDetails())) {
        return true
    } else {
      this.router.navigate(['/'])
      return false
    }
  }
}
