import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users$: Observable<any>;

  userRoles: any = [
    {
      "type": "admin",
      "name": "Administrator"
    },
    {
      "type": "company",
      "name": "Bedrijf"
    },
    {
      "type": "client",
      "name": "klant"
    }
  ]

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {}

  getUserRoles() {
    return this.userRoles
  }

  public roleName(type: string) {
    try {
      return this.userRoles.find(role => role.type === type).name;
    } catch (error) {
      return 'Onbekend'
    }

  }

  getUsers(invalidateCache: boolean = false): Observable<any> {
    if (this.users$ && !invalidateCache) {
      return this.users$;
    }
    this.users$ = this.api.getUsers().pipe(shareReplay(1));
    return this.users$;
  }

  async userToName(userId): Promise<string> {
    const companies = await this.getUsers().toPromise();
    try {
      return companies.find(user => user._id === userId).name;
    } catch (error) {
      return userId
    }
  }
}
