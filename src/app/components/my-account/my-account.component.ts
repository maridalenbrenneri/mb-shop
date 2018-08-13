import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  user: User;

  constructor(private authService: AuthService) {
    this.user = new User();
  }

  ngOnInit() {
    if (this.isSignedIn()) {
      this.user = this.authService.getUser();
    }
  }

  isSignedIn() {
    return this.authService.isSignedIn();
  }
}
