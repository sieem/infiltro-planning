import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  users: any

  constructor(
    private router: Router,
    private api: ApiService,
    private toastr: ToastrService) { }

  saveToken(token) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  loggedIn() {
    return !!localStorage.getItem('token')
  }

  logoutUser() {
    if(confirm("Zeker dat je wilt uitloggen?")) {
      localStorage.removeItem('token')
      this.router.navigate(['/inloggen'])
    }
  }

  getUserDetails() {
    const token = this.getToken()
    if(token) {
      return jwt_decode(token)
    } else {
      return false
    }
  }

  isAdmin() {
    if (this.loggedIn) return this.getUserDetails().role === 'admin'
    else return false
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
    if (!this.users) {
      this.api.getUsers().subscribe(
        res => {
          this.users = res
          return this.users
        },
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    } else {
      return this.users
    }
  }

  userToName(userId) {
    for (const user of this.getUsers()) {
      if (user._id === userId) {
        return user.name
      }
    }

    return userId
  }
  
  
}
