import { Component } from '@angular/core';
import { AuthService } from './shop/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Maridalen Brenneri';

  constructor(private authService: AuthService) { }

  ngOnInit() { 
    this.authService.trySignInFromStoredCredentials();
  }

  get isSignedIn() {
    return this.authService.isSignedIn;
  }
}
