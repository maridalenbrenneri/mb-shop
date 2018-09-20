import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../../services/basket.service';
import { OrderItem } from '../../../models/order.model';

@Component({
  selector: 'app-mini-basket',
  templateUrl: './mini-basket.component.html',
  styleUrls: ['./mini-basket.component.scss']
})
export class MiniBasketComponent implements OnInit {

  itemCount: number;
  productAdded: boolean;

  constructor(private basketService: BasketService) {
    this.productAdded = false;
  }

  ngOnInit() {
    this.basketService.simpleObservable.subscribe(itemCount => {
      this.itemCount = itemCount;

      // todo: zoom animation does not work... :(
      // if (itemCount > 0) {
      //   this.productAdded = true;
      //   setTimeout(function() { this.productAdded = false; }, 1000);
      // }
    });
  }

  showBasket() {

  }
}
