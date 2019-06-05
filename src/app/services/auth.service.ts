import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDetails: any
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

  constructor(private router: Router, private api:ApiService) { }

  loggedIn() {
    return localStorage.loggedIn
  }

  logoutUser() {
    this.api.logoutUser().subscribe(
      res => {
        this.userDetails = undefined
        localStorage.loggedIn = false
        this.router.navigate(['/'])
      },
      err => console.log(err)
    )
    
  }

  saveUserDetails() {
    this.api.getUserDetails().subscribe(
      res => {
        this.userDetails = res
        return this.userDetails
      },
      err => console.log(err)
    )
  }

  getUserDetails() {
    if (!this.userDetails) {
      this.saveUserDetails()
    } else {
      return this.userDetails
    }
  }

  getUserRoles() {
    return this.userRoles
  }
}
