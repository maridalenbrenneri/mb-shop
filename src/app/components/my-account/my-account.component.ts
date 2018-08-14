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
  tested: string;

  constructor(private authService: AuthService) {
    this.user = new User();
  }

  ngOnInit() {
    if (!this.isSignedIn()) {
      return;
    }

    this.authService.getUser().subscribe(user => {
        this.user = user;
    });
  }

  onSignedIn(signedIn: boolean) {
    this.authService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  isSignedIn() {
    return this.authService.isSignedIn();
  }
}
