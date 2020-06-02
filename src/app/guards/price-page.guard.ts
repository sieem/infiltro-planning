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

  async canActivate(route: ActivatedRouteSnapshot): boolean {
    if (await this.companyService.pricePageVisible()) {
        return true
    } else {
      this.router.navigate(['/'])
      return false
    }
  }
}
