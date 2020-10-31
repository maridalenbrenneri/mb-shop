import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { Subscription } from '../../models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Array<Subscription>;
  customers: Array<Customer>;

  constructor(
    private subscriptionService: SubscriptionService,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadSubscriptions();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
    });
  }

  loadSubscriptions() {
    this.subscriptionService.getSubscriptions().subscribe(
      (subscriptions) => {
        this.subscriptions = subscriptions;
      },
      (e) => {
        console.error('Error', e);
        this.toastr.error('Error when loading subscriptions');
      }
    );
  }

  createOrder(subscription: Subscription) {
    const customer = this.customers.find(
      (c) => c.customerNumber.toString() === subscription.customerId
    );

    if (!customer) {
      console.log('Invalid customer', subscription.customerId);
      return;
    }

    this.subscriptionService
      .createOrderForSubscription(subscription, customer)
      .subscribe(
        (order) => {
          this.toastr.success(`Order ${order.id} was created`);
          this.loadSubscriptions();
        },
        (e) => {
          console.error('Error', e);
          this.toastr.error(e.error);
        }
      );
  }

  openEditSubscriptionDialog(subscription: Subscription): void {
    if (!subscription) {
      subscription = new Subscription();
      subscription.frequence = '1';
      subscription.status = 'active';
      subscription.customerId = '' + this.customers[0].customerNumber;
    }

    const dialogRef = this.dialog.open(EditSubscriptionComponent, {
      disableClose: true,
      data: {
        id: subscription.id,
        frequence: subscription.frequence,
        quantity250: subscription.quantity250,
        quantity500: subscription.quantity500,
        quantity1200: subscription.quantity1200,
        status: subscription.status,
        note: subscription.note || '',
        customerName: subscription.customerName,
        customerId: subscription.customerId,
        frequences: [
          { value: 1, label: 'Månedlig' },
          { value: 2, label: 'To ganger i månaden' },
        ],
        statuses: [
          { value: 'active', label: 'Aktiv' },
          { value: 'paused', label: 'På pause' },
          { value: 'cancelled', label: 'Kansellert' },
        ],
        customers: this.customers,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      subscription.frequence = result.frequence;
      subscription.quantity250 = result.quantity250;
      subscription.quantity500 = result.quantity500;
      subscription.quantity1200 = result.quantity1200;
      subscription.status = result.status;
      subscription.note = result.note;
      subscription.customerId = result.customerId;

      if (!this.alreadyContainsSubscription(subscription)) {
        // resolve customer name
        subscription.customerName = this.customers.find(
          (c) => c.customerNumber === result.customerId
        ).name;
        this.subscriptionService.createSubscription(subscription).subscribe(
          () => {
            this.loadSubscriptions();
            this.toastr.success('Subscription created');
          },
          (err) => {
            console.error('Error', err);
            this.toastr.error('Error when creating subscription');
          }
        );
      } else {
        this.subscriptionService.updateSubscription(subscription).subscribe(
          () => {
            this.loadSubscriptions();
            this.toastr.success('Subscription updated');
          },
          (err) => {
            console.error('Error', err);
            this.toastr.error('Error when updating subscription');
          }
        );
      }
    });
  }

  alreadyContainsSubscription(subscription: Subscription) {
    const items = this.subscriptions.filter(
      (p) => p.id && p.id === subscription.id
    );
    return items.length > 0;
  }

  resolveQuantityString(subscription: Subscription) {
    let quantity = 0;

    if (subscription.quantity250 > 0)
      quantity += 250 * subscription.quantity250;
    if (subscription.quantity500 > 0)
      quantity += 500 * subscription.quantity500;
    if (subscription.quantity1200 > 0)
      quantity += 1200 * subscription.quantity1200;

    return `${quantity / 1000}kg`;
  }
}

export interface EditSubscriptionData {
  id: number;
  frequence: number;
  quantityKg: number; // TODO: obsolete
  quantity250: number;
  quantity500: number;
  quantity1200: number;
  status: string;
  note: string;
  customerName: string;
  frequences: [];
  statuses: [];
}

@Component({
  selector: 'edit-subscription.component',
  templateUrl: 'edit-subscription.component.html',
})
export class EditSubscriptionComponent {
  constructor(
    public dialogRef: MatDialogRef<EditSubscriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditSubscriptionData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
