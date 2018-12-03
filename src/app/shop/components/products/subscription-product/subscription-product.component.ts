import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../../models/product.model';
import { SubscriptionService } from '../../../services/subscription.service';
import { BasketService } from '../../../services/basket.service';
import { SubscriptionFrequence } from '../../../../constants';

@Component({
  selector: 'app-subscription-product',
  templateUrl: './subscription-product.component.html',
  styleUrls: ['./subscription-product.component.scss']
})
export class SubscriptionProductComponent implements OnInit {

  @Input() product: Product;

  nextDeliveryDates: Array<Date>;
  quantities: Array<number>;
  selectedQuantity: number;
  selectedFrequence: number;
  selectedFirstDeliveryDate: Date;

  constructor(private subscriptionService: SubscriptionService, private basketService: BasketService) {
    this.nextDeliveryDates = new Array<Date>();
    this.quantities = [1, 2, 3, 4, 5, 6];
    this.selectedQuantity = 2;
    this.selectedFrequence = SubscriptionFrequence.fortnightly;
  }

  ngOnInit() {
    this.subscriptionService.getNextDeliveryDates().subscribe(dates => {
      this.nextDeliveryDates = dates.nextFortnightlyList;
      this.selectedFirstDeliveryDate = this.nextDeliveryDates[0];
    });
  }

  buyProduct() {
    const subscriptionOptions = {
      quantity: this.selectedQuantity,
      frequence: this.selectedFrequence,
      firstDeliveryDate: this.selectedFirstDeliveryDate
    };

    this.basketService.add(this.product, 1, subscriptionOptions);
  }

}
