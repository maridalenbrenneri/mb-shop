import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/internal/operators/catchError";
import { finalize } from "rxjs/operators";
import { LoaderService } from "./loader/loader.service";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class HttpStuffInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService,
    private loader: LoaderService,
    private toastr: ToastrService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loader.show();

    const token = this.auth.getToken() != null ? this.auth.getToken() : "";

    // temp hack, wp api does not allow access token
    if (!req.url.includes("https://maridalenbrenneri.no/wp-json")) {
      req = (req as HttpRequest<any>).clone({
        setHeaders: {
          "x-access-token": token,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((err) => {
        this.handleError(err);
        throw err;
      }),
      finalize(() => {
        this.loader.hide();
      })
    );
  }

  handleError(err) {
    if (err instanceof HttpErrorResponse) {
      console.error(`${err.status} ${err.message} ${err.error}`);
      this.toastr.error(`An error occured: ${err.error}`);
    } else {
      console.error("Oops, an error occured when calling a service:" + err);
      this.toastr.error(
        `Oops, an error occured when calling a service: ${err}`
      );
    }
  }
}
