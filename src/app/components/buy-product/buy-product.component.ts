import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { Product } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';
import { quantityValidator } from '../../core/validators';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.scss']
})
export class BuyProductComponent implements OnInit {

  @Input() product: Product;
  @Input() quantityVisible = false;
  buyProductForm: FormGroup;

  constructor(private basketService: BasketService, private fb: FormBuilder, private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    console.log('[DEBUG] buy-product init, basketService random: ' + this.basketService.random);
  }

  createForm() {
    this.buyProductForm = this.fb.group({
      quantity: [1, [Validators.required, quantityValidator()]]
    });
  }

  buyProduct() {
    if (this.product.type === 'coffee-subscription' || this.product.type === 'coffee-gift-subscription' ) {
      this.router.navigateByUrl(`products/${this.product.id}`);
      return;
    }

    this.basketService.add(this.product, this.buyProductForm.value.quantity, null);
  }
}
