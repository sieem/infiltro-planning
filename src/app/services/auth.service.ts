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
    this.userDetails = null
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
    if(this.loggedIn()) {
      if (!this.userDetails) {
        this.saveUserDetails()
      } else {
        return this.userDetails
      }
    } else {
      return null
    }
    
  }

  getUserRoles() {
    return this.userRoles
  }
}
