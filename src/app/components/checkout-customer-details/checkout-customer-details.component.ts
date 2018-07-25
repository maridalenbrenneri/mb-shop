import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderCustomer } from '../../models/order.model';

@Component({
  selector: 'app-checkout-customer-details',
  templateUrl: './checkout-customer-details.component.html',
  styleUrls: ['./checkout-customer-details.component.scss']
})
export class CheckoutCustomerDetailsComponent implements OnInit {

  detailsForm: FormGroup;
  customer: OrderCustomer;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
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
      note: ['']
    });
  }
}
