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

  users: any = []

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
    let name: string
    this.userRoles.forEach(role => {
      if (role.type === type) {
        name = role.name
      }
    })
    return name || 'Onbekend'

  }

  getUsers() {
    this.api.getUsers().subscribe(
      res => {
        this.users = res
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  userToName(userId) {
    for (const user of this.users) {
      if (user._id === userId) {
        return user.name
      }
    }

    return userId
  }
}
