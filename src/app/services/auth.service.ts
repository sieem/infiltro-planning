import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router
    ) {
  }

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
}
