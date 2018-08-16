import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken() != null ? this.auth.getToken() : '';

    req = (req as HttpRequest<any>).clone({
      setHeaders: {
        'x-access-token': token
      }
    });

    return next.handle(req).pipe(catchError((err, caugth) => {
      this.handleError(err);
      return caugth;
    }));
  }

  handleError(err) {
    if (err instanceof HttpErrorResponse) {
      console.error(err.message);

    } else {
      console.error('Oops, an error occured when calling a service. ' + err);
    }
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   request = request.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${this.auth.getToken()}`
  //     }s
  //   });

  //   return next.handle(request);
  // }
}
