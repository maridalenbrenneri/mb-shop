import { Component, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoadingIndicatorInterceptor implements HttpInterceptor {
  
  constructor(private loadingIndicatorService: LoadingIndicatorService) {}
  
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // emit onStarted event before request execution
    this.loadingIndicatorService.onStarted(req);
    
    return next
      .handle(req)
      // emit onFinished event after request execution
      .finally(() => this.loadingIndicatorService.onFinished(req));
  }
  
}

@Injectable()
export class LoadingIndicatorService {

    private _loading: boolean = false;

    get loading(): boolean {
        return this._loading;
    }

    onRequestStarted(): void {
        this._loading = true;
    }

    onRequestFinished(): void {
        this._loading = false;
    }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Maridalen Brenneri';
}
