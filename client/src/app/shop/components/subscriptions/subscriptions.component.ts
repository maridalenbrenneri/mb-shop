import { Component, OnInit, Inject } from "@angular/core";
import { Subscription } from "../../models/subscription.model";
import { SubscriptionService } from "../../services/subscription.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-subscriptions",
  templateUrl: "./subscriptions.component.html",
  styleUrls: ["./subscriptions.component.scss"]
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: Array<Subscription>;

  private _showNotActiveCoffees: boolean = false;

  constructor(
    private subscriptionService: SubscriptionService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subscriptionService.getSubscriptions().subscribe(
      subscriptions => {
        if (!this._showNotActiveCoffees) {
          this.subscriptions = subscriptions.filter(s => s.status === "active");
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
    }

    const dialogRef = this.dialog.open(EditSubscriptionComponent, {
      disableClose: true,
      data: {
        frequency: subscription.frequency,
        quantityKg: subscription.quantityKg,
        status: subscription.status
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      subscription.frequency = result.code;
      subscription.quantityKg = result.country;
      subscription.status = result.name;

      if (!this.alreadyContainsSubscription(subscription)) {
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
  frequency: number;
  quantityKg: number;
  status: string;
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
