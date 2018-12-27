import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { finalize, tap } from 'rxjs/operators';
import { LoaderService } from './loader/loader.service';

@Injectable()
export class HttpStuffInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService, private loader: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loader.show();

    const token = this.auth.getToken() != null ? this.auth.getToken() : '';

    // temp hack, wp api does not allow access token
    if(!req.url.includes('https://maridalenbrenneri.no/wp-json')) {
      req = (req as HttpRequest<any>).clone({
        setHeaders: {
          'x-access-token': token
        }
      });
    }

    return next.handle(req).pipe(catchError((err) => {
      this.handleError(err);
      throw err;
    }),
    finalize(() => {
      this.loader.hide();
    }));
  }

  // intercept2(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //   this.loader.show();

  //   return next.handle(request)
  //     .pipe(
  //       tap(),
  //       finalize(() => {
  //         this.loader.hide();
  //       })
  //     );
  // }

  handleError(err) {
    if (err instanceof HttpErrorResponse) {
      console.log(`${err.status} ${err.message}`);

    } else {
      console.log('Oops, an error occured when calling a service. ' + err);
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
