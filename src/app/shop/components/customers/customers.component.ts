import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TableDataSource } from '../../core/table-data-source';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CustomersComponent implements OnInit {

  customerTypes: string[] = ['Café/Butikk', 'Kontor'];

  displayedColumns: string[] = ['id', 'name', 'organizationNumber', 'email', 'phone'];
  customers: Array<Customer>;
  dataSource: TableDataSource;
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(public dialog: MatDialog, private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers();
  }

  openEditCustomerDialog(customer: Customer): void {
    if (!customer) {
      customer = new Customer();
      customer.type = this.customerTypes[0];
      customer.deliveryAddress.country = "Norge";
      customer.invoiceAddress.country = "Norge";
    }

    const dialogRef = this.dialog.open(EditCustomerComponent, {
      disableClose: true,
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        organizationNumber: customer.organizationNumber,
        phone: customer.phone,
        contactPerson: customer.contactPerson,
        deliveryAddress: customer.deliveryAddress,
        invoiceAddress: customer.invoiceAddress,
        note: customer.note,
        type: customer.type,
        customerTypes: this.customerTypes
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      customer.id = result.id;
      customer.name = result.name;
      customer.email = result.email;
      customer.organizationNumber = result.organizationNumber;
      customer.contactPerson = result.contactPerson;
      customer.phone = result.phone;
      customer.deliveryAddress = result.deliveryAddress;
      customer.invoiceAddress = result.invoiceAddress;
      customer.note = result.note;
      customer.type = result.type;

      if (!this.containsItem(customer)) {
        this.customerService.createCustomer(customer).subscribe(() => {
          this.loadCustomers();
        });

      } else {
        this.customerService.updateCustomer(customer).subscribe(() => {
          this.loadCustomers();
        });
      }
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.dataSource = new TableDataSource(this.customers);
    });
  }

  containsItem(customer: Customer) {
    const items = this.customers.filter(u => u.id && u.id === customer.id);
    return items.length > 0;
  }
}

@Component({
  selector: 'edit-customer.component',
  templateUrl: 'edit-customer.component.html',
})
export class EditCustomerComponent {

  constructor(
    public dialogRef: MatDialogRef<EditCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
