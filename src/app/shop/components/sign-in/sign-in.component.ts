import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;
  @Output() signedIn = new EventEmitter<boolean>();
  @Output() tested = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private fb: FormBuilder, private toastr: ToastrService) { }

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
      this.toastr.success('Logget inn');
    
    }, err => {
      if(err.code == 401) {
        this.toastr.error('Sign in failed, username or password is wrong.');
        this.authService.signOut(); 

      } else {
        this.toastr.error('An error occured when trying to sign in');
      }
    });
  }

  signOut() {
    this.authService.signOut();
  }

  get isSignedIn() {
    return this.authService.isSignedIn;
  }

  get signedInUserName() {
    return this.authService.userEmail;
  }
}
