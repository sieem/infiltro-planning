import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  users: any;

  constructor(
    private api: ApiService,
    private toastr: ToastrService
  ) {
    this.getUsers()
  }

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

  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.getUsers().subscribe(
        res => {
          return resolve(res)
        },
        err => {
          this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
          return reject()
        }
      )
    })
  }

  async userToName(userId): Promise<string> {
    if (!this.users) {
      this.users = await this.getUsers();
    }
    for (const user of this.users) {
      if (user._id === userId) {
        return user.name
      }
    }

    return userId
  }
}
