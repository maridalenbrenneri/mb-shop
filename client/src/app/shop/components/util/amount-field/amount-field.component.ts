import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-amount-field',
  templateUrl: './amount-field.component.html',
  styleUrls: ['./amount-field.component.scss']
})
export class AmountFieldComponent implements OnInit {

  @Input() amount = 0;

  constructor() { }

  ngOnInit() {
  }

  get amountString() {
    return Math.round(this.amount  * 100) / 100;
  }
}
