import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderCustomer } from '../../../models/order.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-checkout-customer-details',
  templateUrl: './checkout-customer-details.component.html',
  styleUrls: ['./checkout-customer-details.component.scss']
})
export class CheckoutCustomerDetailsComponent implements OnInit {

  private _customer: OrderCustomer;
  @Output() customerUpdated = new EventEmitter<OrderCustomer>();
  detailsForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.onChanges();
  }

  get customer(): OrderCustomer {
    return this._customer;
  }

  @Input()
  set customer(customer: OrderCustomer) {
    this._customer = customer;
    this.updateDetailsForm();
  }

  createForm() {
    this.detailsForm = this.fb.group({
      givenName: ['', Validators.required],
      familyName: ['', Validators.required],
      company: [''],
      street1: ['', Validators.required],
      street2: [''],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]')]],
      place: ['', Validators.required],
      country: ['Norge', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      note: [''],
      createAccount: [true],
      password: [''],
      confirmPassword: ['']
    });
  }

  updateDetailsForm() {
    if (!this.detailsForm) {
      return;
    }

    this.detailsForm.patchValue({
      givenName: this.customer.givenName,
      familyName: this.customer.familyName,
      email: this.customer.email,
      phone: this.customer.phone
    });
  }

  onChanges(): void {
    this.detailsForm.valueChanges.subscribe(val => {

      this.customer.givenName = val.givenName;

      // familyName: this.customer.familyName,
      // email: this.customer.email,
      // phone: this.customer.phone

      console.log(`Hello,  ${val.givenName}`);

      this.customerUpdated.emit(this.customer);
    });
  }
}
