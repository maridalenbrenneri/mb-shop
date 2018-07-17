import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.signInForm = this.fb.group({
      email: ['bjodadev@gmail.com', Validators.required],
      password: ['', Validators.required]
    });
  }

  signIn() {
    this.authService.signIn(this.signInForm.value.email, this.signInForm.value.password);
  }

  signOut() {
    this.authService.signOut();
  }

  isSignedIn() {
    return this.authService.isSignedIn();
  }

  signedInUserName() {
    return this.authService.username;
  }
}
