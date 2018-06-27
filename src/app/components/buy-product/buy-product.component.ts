import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.scss']
})
export class BuyProductComponent implements OnInit {

  @Input() product: Product;
  quantity: number = 1;

  constructor(private basketService: BasketService) { }

  ngOnInit() {
  }

  buyProduct() {
    console.log("DEBUG: Adding product " + this.product.name);
    
    this.basketService.addProductItem({
      product: this.product, 
      quantity: this.quantity
    });
  }
}
