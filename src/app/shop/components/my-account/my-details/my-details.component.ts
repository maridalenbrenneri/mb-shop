import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
  private _user: User;

  detailsForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor( private fb: FormBuilder) {
    this._user = new User();
  }

  ngOnInit() {
    this.createForms();
  }

  get user(): User {
    return this._user;
  }

  @Input()
  set user(user: User) {
    this._user = user;
    this.updateDetailsForm();
  }

  canDetailsUpdate() {
    return this.detailsForm.valid && this.detailsForm.touched;
  }

  canChangePasswordUpdate() {
    return this.changePasswordForm.valid && this.detailsForm.touched;
  }

  saveDetails() {

  }

  changePassword() {

  }

  updateDetailsForm() {
    if (!this.detailsForm) {
      return;
    }

    this.detailsForm.patchValue({
      // name: this.user.name,
      // organizationNumber: this.user.organizationNumber,
      email: this.user.email,
      // phone: this.user.phone,
      // contactPerson: this.user.contactPerson
    });
  }

  createForms() {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      organizationNumber: ['', Validators.required],
      email: ['', Validators.required],
      mobile: [''],
      contactPerson: [''],
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
