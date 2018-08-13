import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
  @Input() user: User;

  detailsForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.user = new User();
  }

  ngOnInit() {
    this.createForms();
  }

  canDetailsUpdate() {
    return this.detailsForm.valid && this.detailsForm.touched;
  }

  canChangePasswordUpdate() {
    return this.changePasswordForm.valid && this.detailsForm.touched;
  }

  createForms() {
    this.detailsForm = this.fb.group({
      firstName: [this.user.givenName, Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: [''],
      currentPassword: [''],
      newPassword: [''],
      confirmNewPassword: ['']
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }
}
