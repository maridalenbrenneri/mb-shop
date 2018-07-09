import { Component, OnInit } from '@angular/core';
import { ProductItem } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  items: Array<ProductItem> = [];

  constructor(private basketService: BasketService) { }

  ngOnInit() {
    console.log("basket init, basketService random: " + this.basketService.random);

    this.basketService.getItems().subscribe(items => this.items = items);

    console.log("count: " + this.items.length)
  }

  add() {
   
  }
}
