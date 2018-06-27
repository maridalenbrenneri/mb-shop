import { Component, OnInit } from '@angular/core';
import { ProductItem } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  productItems: Array<ProductItem> = [];

  constructor(private basketService: BasketService) {
    
   }

  ngOnInit() {
    console.log("count: " + this.productItems.length)
  }

}
