import { Component, OnInit, Input } from '@angular/core';
import { ProductItem } from '../../models/product.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  @Input() isCheckoutModel: boolean = false;
  items: Array<ProductItem> = [];

  constructor(private basketService: BasketService) { }

  ngOnInit() {
    console.log("basket init, basketService random: " + this.basketService.random);

    this.basketService.getItems().subscribe(items => this.items = items);

    console.log("count: " + this.items.length)
  }

  getTotalPrice() : number {
    let total = 0;
    this.items.forEach(i => {
      total += i.product.price * i.quantity;
    });
    return total;
  }

  getTotalPriceWithoutMva() : number {
    return this.getTotalPrice() - this.getTotalMva();
  }

  getTotalMva() : number {
    return this.getTotalPrice() * 0.25;
  }
}
