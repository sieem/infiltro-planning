import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { AuthService } from './auth.service';
import { catchError, Observable, switchMap, of, retry, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        retry(1),
        catchError((returnedError) => {
          if (returnedError instanceof HttpErrorResponse) {
            if (returnedError.error === 'User not found') {
              this.auth.logoutUser();
            } else {
              this.toastr.error(returnedError.error, `Error ${returnedError.status}: ${returnedError.statusText}`);
            }
          }

          return of(returnedError);
        })
      )
  }

}
