import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;
  @Output() signedIn = new EventEmitter<boolean>();
  @Output() tested = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForms();
  }

  createForms() {
    this.signInForm = this.fb.group({
      email: ['kaffe@maridalenbrenneri.no', Validators.required],
      password: ['Wq2i!3z7', Validators.required]
    });
  }

  signIn() {
    this.authService.signIn(this.signInForm.value.email, this.signInForm.value.password).subscribe(result => {
      this.authService.setSignedIn(result);
      this.signedIn.emit(true);
    });
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
