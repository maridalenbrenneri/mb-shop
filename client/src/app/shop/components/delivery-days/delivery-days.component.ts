import { Component, OnInit, Inject } from "@angular/core";
import { DeliveryDay } from "../../models/delivery-day.model";
import { DeliveryDayService } from "../../services/delivery-day.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { CoffeeService } from "../../services/coffee.service";
import { Coffee } from "../../models/coffee.model";

@Component({
  selector: "app-delivery-days",
  templateUrl: "./delivery-days.component.html",
  styleUrls: ["./delivery-days.component.scss"],
})
export class DeliveryDaysComponent implements OnInit {
  deliveryDays: Array<DeliveryDay>;
  coffees: Array<Coffee>;

  constructor(
    private deliveryDayService: DeliveryDayService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private coffeeService: CoffeeService
  ) {}

  ngOnInit() {
    this.loadDeliveryDays();
    this.loadCoffees();
  }

  loadCoffees() {
    this.coffeeService.getCoffees(false).subscribe(
      (coffees) => {
        this.coffees = coffees.filter((c) => c.id > 1); // exclude ANY
      },
      () => {
        this.toastr.error("Error when loading coffees");
      }
    );
  }

  loadDeliveryDays() {
    this.deliveryDayService.getDeliveryDays().subscribe(
      (deliveryDays) => {
        this.deliveryDays = deliveryDays;
      },
      () => {
        this.toastr.error("Error when loading delivery days");
      }
    );
  }

  resolveCoffeeCodeFromId = (id) => {
    if (!this.coffees) return "";
    const coffee = this.coffees.find((c) => c.id === id);
    if (!coffee) return "";
    return coffee.code;
  };

  resolveDeliveryTypeString(type: string) {
    if (type === "monthly") return "Stor-abo";
    if (type === "fortnightly") return "Lill-abo";
    return "Kun enkeltordre";
  }

  openEditDeliveryDayDialog(deliveryDay: DeliveryDay): void {
    const dialogRef = this.dialog.open(EditDeliveryDayComponent, {
      disableClose: true,
      data: {
        coffees: this.coffees,
        deliveryDay: deliveryDay,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      deliveryDay.coffee1 = result.deliveryDay.coffee1;
      deliveryDay.coffee2 = result.deliveryDay.coffee2;
      deliveryDay.coffee3 = result.deliveryDay.coffee3;
      deliveryDay.coffee4 = result.deliveryDay.coffee4;

      this.deliveryDayService.updateDeliveryDay(deliveryDay).subscribe(
        () => {
          this.loadDeliveryDays();
          this.toastr.success("Delivery day was updated");
        },
        (err) => {
          this.toastr.error("Error when updating delivery day");
        }
      );
    });
  }
}

export interface EditDeliveryDayData {
  coffees: Array<Coffee>;
  deliveryDay: DeliveryDay;
}

@Component({
  selector: "edit-delivery-day.component",
  templateUrl: "edit-delivery-day.component.html",
})
export class EditDeliveryDayComponent {
  constructor(
    public dialogRef: MatDialogRef<EditDeliveryDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditDeliveryDayData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
