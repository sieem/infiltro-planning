import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next) {
    let localToken = localStorage.getItem('token')
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localToken}`
      }
    })
    return next.handle(tokenizedReq)
  }
}
