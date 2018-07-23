import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { Product } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.scss']
})
export class BuyProductComponent implements OnInit {

  @Input() product: Product;
  @Input() quantityVisible: boolean = false;
  buyProductForm: FormGroup;

  constructor(private basketService: BasketService, private fb: FormBuilder) { 
    this.createForm();
  }

  ngOnInit() {
    console.log("[DEBUG] buy-product init, basketService random: " + this.basketService.random);
  }

  createForm() {
    this.buyProductForm = this.fb.group({
      quantity: [1, Validators.required]
    });
  }

  buyProduct() {  
    if(this.product.isSubscription()) {
      // todo: route to product page
      console.log("Subscription, should navigate to product page");
      return;
    }
    this.basketService.add(this.product, this.buyProductForm.value.quantity, null);
  }
}
