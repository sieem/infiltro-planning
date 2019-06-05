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
      "sort": "admin",
      "name": "Administrator"
    },
    {
      "sort": "company",
      "name": "Bedrijf"
    },
    {
      "sort": "client",
      "name": "klant"
    }
  ]

  constructor(private router: Router, private api:ApiService) { }

  loggedIn() {
    return !!localStorage.getItem('token')
  }

  getToken() {
    return localStorage.getItem('token')
  }

  logoutUser() {
    localStorage.removeItem('token')
    this.router.navigate(['/'])
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
