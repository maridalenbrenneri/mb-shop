import { Component, OnInit, Inject } from "@angular/core";
import { Subscription } from "../../models/subscription.model";
import { SubscriptionService } from "../../services/subscription.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { Customer } from "../../models/customer.model";
import { CustomerService } from "../../services/customer.service";

@Component({
  selector: "app-subscriptions",
  templateUrl: "./subscriptions.component.html",
  styleUrls: ["./subscriptions.component.scss"]
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Array<Subscription>;
  customers: Array<Customer>;

  private _showNotActiveCoffees: boolean = false;

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
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  loadSubscriptions() {
    this.subscriptionService.getSubscriptions().subscribe(
      subscriptions => {
        if (!this._showNotActiveCoffees) {
          this.subscriptions = subscriptions;
        }
      },
      () => {
        this.toastr.error("Error when loading subscriptions");
      }
    );
  }

  openEditSubscriptionDialog(subscription: Subscription): void {
    if (!subscription) {
      subscription = new Subscription();
      subscription.frequence = "1";
      subscription.status = "active";
      subscription.customerId = "" + this.customers[0].customerNumber;
    }

    const dialogRef = this.dialog.open(EditSubscriptionComponent, {
      disableClose: true,
      data: {
        id: subscription.id,
        frequence: subscription.frequence,
        quantityKg: subscription.quantityKg,
        status: subscription.status,
        note: subscription.note || "",
        customerName: subscription.customerName,
        customerId: subscription.customerId,
        frequences: [
          { value: 1, label: "Månedlig" },
          { value: 2, label: "Annenhver uke" }
        ],
        statuses: [
          { value: "active", label: "Aktiv" },
          { value: "paused", label: "På pause" },
          { value: "cancelled", label: "Kansellert" }
        ],
        customers: this.customers
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      subscription.frequence = result.frequence;
      subscription.quantityKg = result.quantityKg;
      subscription.status = result.status;
      subscription.note = result.note;
      subscription.customerId = result.customerId;

      if (!this.alreadyContainsSubscription(subscription)) {
        // resolve customer name
        subscription.customerName = this.customers.find(
          c => c.customerNumber === result.customerId
        ).name;
        this.subscriptionService.createSubscription(subscription).subscribe(
          () => {
            this.loadSubscriptions();
            this.toastr.success("Subscription created");
          },
          err => {
            this.toastr.error("Error when creating subscription");
          }
        );
      } else {
        this.subscriptionService.updateSubscription(subscription).subscribe(
          () => {
            this.loadSubscriptions();
            this.toastr.success("Subscription updated");
          },
          err => {
            this.toastr.error("Error when updating subscription");
          }
        );
      }
    });
  }

  alreadyContainsSubscription(subscription: Subscription) {
    const items = this.subscriptions.filter(
      p => p.id && p.id === subscription.id
    );
    return items.length > 0;
  }
}

export interface EditSubscriptionData {
  id: number;
  frequence: number;
  quantityKg: number;
  status: string;
  note: string;
  customerName: string;
  frequences: [];
  statuses: [];
}

@Component({
  selector: "edit-subscription.component",
  templateUrl: "edit-subscription.component.html"
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
