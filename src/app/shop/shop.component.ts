import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() { 
    this.authService.trySignInFromStoredCredentials();
  }

  get isSignedIn() {
    return this.authService.isSignedIn;
  }
}
