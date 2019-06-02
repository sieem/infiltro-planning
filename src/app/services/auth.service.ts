import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDetails: any

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
      res => this.userDetails = res,
      err => console.log(err)
    )
  }
}
