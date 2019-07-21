import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth:AuthService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.auth.loggedIn()) {
      if (route.data.roles) {
        if (route.data.roles.includes(this.auth.getUserDetails().role)) {
          return true
        } else {
          this.router.navigate(['/inloggen'])
          return false
        }
      } else {
        return true
      }
    } else {
      this.router.navigate(['/inloggen'])
      return false
    }
  }
}
