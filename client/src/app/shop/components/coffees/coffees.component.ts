import { Component, OnInit, Inject } from "@angular/core";
import { Coffee } from "../../models/coffee.model";
import { CoffeeService } from "../../services/coffee.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-coffees",
  templateUrl: "./coffees.component.html",
  styleUrls: ["./coffees.component.scss"]
})
export class CoffeesComponent implements OnInit {
  vatCoffee = 15;

  text: string;
  coffeeCoffees: Array<Coffee>;

  private _showNotActiveCoffees: boolean = false;

  constructor(
    private coffeeService: CoffeeService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadCoffees();
  }

  loadCoffees() {
    this.coffeeService.getCoffees().subscribe(
      coffees => {
        if (!this._showNotActiveCoffees) {
          this.coffeeCoffees = coffees.filter(coffee => coffee.isActive);
        }
      },
      () => {
        this.toastr.error("Error when loading coffees");
      }
    );
  }

  openEditCoffeeDialog(coffee: Coffee): void {
    if (!coffee) {
      coffee = new Coffee();
    }

    const dialogRef = this.dialog.open(EditCoffeeComponent, {
      disableClose: true,
      data: {
        code: coffee.code,
        country: coffee.country,
        name: coffee.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      coffee.isActive = true;
      coffee.isInStock = true;

      coffee.code = result.code;
      coffee.country = result.country;
      coffee.name = result.name;

      if (!this.alreadyContainsCoffee(coffee)) {
        this.coffeeService.createCoffee(coffee).subscribe(
          () => {
            this.loadCoffees();
            this.toastr.success("Coffee created");
          },
          err => {
            this.toastr.error("Error when creating coffee");
          }
        );
      } else {
        this.coffeeService.updateCoffee(coffee).subscribe(
          () => {
            this.loadCoffees();
            this.toastr.success("Coffee updated");
          },
          err => {
            this.toastr.error("Error when updating coffee");
          }
        );
      }
    });
  }

  toggleIsActive(coffee: Coffee, active: boolean) {
    coffee.isActive = active;
    this.coffeeService.updateCoffee(coffee).subscribe(
      () => {
        this.loadCoffees();
      },
      err => {
        this.toastr.error("Error when updating coffee");
      }
    );
  }

  set showNotActiveCoffees(show: boolean) {
    this._showNotActiveCoffees = show;
    this.loadCoffees();
  }

  alreadyContainsCoffee(coffee: Coffee) {
    const items = this.coffeeCoffees.filter(p => p.id && p.id === coffee.id);
    return items.length > 0;
  }
}

export interface EditCoffeeCoffeeData {
  code: string;
  country: string;
  name: string;
}

@Component({
  selector: "edit-coffee.component",
  templateUrl: "edit-coffee.component.html"
})
export class EditCoffeeComponent {
  constructor(
    public dialogRef: MatDialogRef<EditCoffeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditCoffeeCoffeeData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
