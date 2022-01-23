import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router
    ) {
  }

  saveToken(token: string) {
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
      return jwtDecode(token) as any
    } else {
      return false
    }
  }

  isAdmin() {
    return this.loggedIn()
      ? this.getUserDetails().role === 'admin'
      : false
  }
}
