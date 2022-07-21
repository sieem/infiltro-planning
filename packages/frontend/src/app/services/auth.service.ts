import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUserToken } from '@infiltro/shared';
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
    localStorage.removeItem('token')
    this.router.navigate(['inloggen'])
  }

  logoutUserWithConfirm() {
    if (confirm("Zeker dat je wilt uitloggen?")) {
      this.logoutUser();
    }
  }

  getUserDetails() {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token) as IUserToken;
    }

    return null;
  }

  isAdmin() {
    return this.loggedIn()
      ? this.getUserDetails()?.role === 'admin'
      : false
  }
}
