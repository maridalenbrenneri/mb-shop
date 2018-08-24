import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-subscription-product',
  templateUrl: './subscription-product.component.html',
  styleUrls: ['./subscription-product.component.scss']
})
export class SubscriptionProductComponent implements OnInit {

  @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

}
