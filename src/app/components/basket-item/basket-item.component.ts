import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderItem } from '../../models/order.model';
import { BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss']
})
export class BasketItemComponent implements OnInit {
  @Input() item: OrderItem;
  @Input() isCheckoutModel: boolean = false;
  quantityForm: FormGroup;

  constructor(private fb: FormBuilder, private basketService: BasketService, ) { }

  ngOnInit() {
    this.createForm();
  }

  add() {
    this.basketService.add(this.item.product, 1, null);
  }

  remove() {
    console.log("remove not yet iplemented...");
  }

  createForm() {
    this.quantityForm = this.fb.group({
      quantity: [this.item.quantity, Validators.required]
    });
  }
}
