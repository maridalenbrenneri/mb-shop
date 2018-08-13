import { Component, OnInit, Input } from '@angular/core';
import { OrderItem } from '../../models/order.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  @Input() isCheckoutModel: boolean = false;
  items: Array<OrderItem> = [];

  constructor(private basketService: BasketService) { }

  ngOnInit() {
    this.basketService.getItems().subscribe(items => this.items = items);
  }

  getTotalPrice() : number {
    let total = 0;
    this.items.forEach(i => {
      total += i.product.price * i.quantity;
    });
    return total;
  }

  getTotalMva(): number {
    
    return this.getTotalPrice() * 0.125;
  }
}
