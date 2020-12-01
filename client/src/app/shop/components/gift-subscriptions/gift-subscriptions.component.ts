import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';
import { GiftSubscription } from '../../models/gift-subscription.model';
import { GiftSubscriptionService } from '../../services/gift-subscription.service';
import { SubscriptionFrequence } from '../../../../constants';

@Component({
  selector: 'app-gift-subscriptions',
  templateUrl: './gift-subscriptions.component.html',
  styleUrls: ['./gift-subscriptions.component.scss'],
})
export class GiftSubscriptionsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'wooOrderNumber',
    'frequency',
    'quantity',
    'firstDelivery',
    'lastOrderCreated',
    'recipient',
    'duration',
    'toolBar',
  ];

  dataSource = new MatTableDataSource<GiftSubscription>([]);
  selection = new SelectionModel<GiftSubscription>(true, []);

  _subscriptions: Array<GiftSubscription> = [];
  _quantities: Array<any> = [];
  _selectedQuantity: any;
  _showMonthly: boolean = true;
  _showFortnightly: boolean = true;
  _showOnlyNew: boolean = false;
  _showOnlyNotSentToday: boolean = false;
  _showOnlyStarted: boolean = true;
  _lastImported: Date = new Date();
  _lastImportedCount: number = 0;

  _isWorking: boolean = false;

  constructor(
    private giftSubscriptionService: GiftSubscriptionService,
    private toastr: ToastrService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this._quantities.push({ quantity: 0, label: 'All' });
    this._quantities.push({ quantity: 1, label: '1 bag' });
    this._quantities.push({ quantity: 2, label: '2 bags' });
    this._quantities.push({ quantity: 3, label: '3 bags' });
    this._quantities.push({ quantity: 4, label: '4 bags' });
    this._quantities.push({ quantity: 5, label: '5 bags' });
    this._quantities.push({ quantity: 6, label: '6 bags' });
    this._quantities.push({ quantity: 7, label: '7 bags' });

    this._selectedQuantity = this._quantities[0];
  }

  ngOnInit() {
    this.loadSubscriptions();

    const self = this;
    this.http
      .get<any>(environment.mbApiBaseUrl + 'woo/data')
      .subscribe((res) => {
        self._lastImported = res.importedAt;
        self._lastImportedCount = res.gaboData.lastImportedCount;
      });
  }

  loadSubscriptions() {
    this.giftSubscriptionService
      .getSubscriptions()
      .subscribe((subscriptions) => {
        this.selection.clear();
        this.subscriptions = subscriptions;
        this.applyFilter();
      });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: GiftSubscription): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  canCreateOrders() {
    return this.selection.selected.length > 0;
  }

  openEditDialog(subscription: GiftSubscription) {
    const config = {
      position: {
        top: '10px',
        left: '10px',
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    };

    const dialogRef = this.dialog.open(EditGiftSubscriptionDialog, {
      ...config,
      data: subscription,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      // TODO: dates does not update
      // console.log('START DATE', result.firstDeliveryDate);

      this.giftSubscriptionService.updateSubscription(result).subscribe(
        () => {
          this.toastr.success('Gift subscription updated');
        },
        (err: any) => {
          console.warn(err);
          this.toastr.error('Error when updating gift subscription');
        }
      );
    });
  }

  openCreateOrdersDialog() {
    const dialogRef = this.dialog.open(CreateGiftSubscriptionOrdersDialog, {
      data: this.selection.selected,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.createOrders(result);
    });
  }

  createOrders(subscriptions: GiftSubscription[]) {
    this._isWorking = true;
    this.giftSubscriptionService.createOrders(subscriptions).subscribe(
      () => {
        this.loadSubscriptions();
        this.toastr.success(
          'Created consignments in Cargonizer for ' +
            subscriptions.length +
            ' gift subscriptions'
        );
        this._isWorking = false;
      },
      (e: any) => {
        console.warn('Error when creating gift subscripton orders', e);
        this.toastr.error(e.error);
      }
    );
  }

  applyFilter() {
    let _filteredSubscriptions: Array<GiftSubscription> = [];

    if (!this._selectedQuantity.quantity) {
      _filteredSubscriptions = this._subscriptions;
    } else {
      _filteredSubscriptions = this._subscriptions.filter(
        (s) => s.quantity === this._selectedQuantity.quantity
      );
    }

    if (!this._showMonthly) {
      _filteredSubscriptions = _filteredSubscriptions.filter(
        (s) => s.frequence !== SubscriptionFrequence.monthly
      );
    }

    if (!this._showFortnightly) {
      _filteredSubscriptions = _filteredSubscriptions.filter(
        (s) => s.frequence !== SubscriptionFrequence.fortnightly
      );
    }

    if (this.showOnlyNew) {
      _filteredSubscriptions = _filteredSubscriptions.filter(
        (s) => !s.lastOrderCreated
      );
    }

    if (this.showOnlyNotSentToday) {
      const today = moment();
      _filteredSubscriptions = _filteredSubscriptions.filter(
        (s) => !moment(s.lastOrderCreated).isSame(today, 'd')
      );
    }

    if (this.showOnlyStarted) {
      let startdate = moment();
      startdate = startdate.add(7, 'days');

      _filteredSubscriptions = _filteredSubscriptions.filter((s) =>
        moment(s.firstDeliveryDate).isSameOrBefore(startdate, 'd')
      );
    }

    this.dataSource = new MatTableDataSource<GiftSubscription>(
      _filteredSubscriptions
    );
  }

  getWooUri(subscription: GiftSubscription) {
    return `https://maridalenbrenneri.no/wp-admin/post.php?post=${subscription.wooOrderId}&action=edit`;
  }
  // PROPS

  set subscriptions(subscriptions: Array<GiftSubscription>) {
    this._subscriptions = subscriptions;
    this.applyFilter();
  }

  set showMonthly(show: boolean) {
    this._showMonthly = show;
    this.applyFilter();
  }

  get showMonthly(): boolean {
    return this._showMonthly;
  }

  set showFortnightly(show: boolean) {
    this._showFortnightly = show;
    this.applyFilter();
  }

  get showFortnightly(): boolean {
    return this._showFortnightly;
  }

  get showOnlyNew(): boolean {
    return this._showOnlyNew;
  }

  set showOnlyNew(show: boolean) {
    this._showOnlyNew = show;
    this.applyFilter();
  }

  get showOnlyNotSentToday(): boolean {
    return this._showOnlyNotSentToday;
  }

  set showOnlyNotSentToday(show: boolean) {
    this._showOnlyNotSentToday = show;
    this.applyFilter();
  }

  get showOnlyStarted(): boolean {
    return this._showOnlyStarted;
  }

  set showOnlyStarted(show: boolean) {
    this._showOnlyStarted = show;
    this.applyFilter();
  }

  set selectedQuantity(quantity) {
    this._selectedQuantity = quantity;
    this.applyFilter();
  }

  get selectedQuantity() {
    return this._selectedQuantity;
  }

  get quantities(): Array<any> {
    return this._quantities;
  }

  get lastImported() {
    return this._lastImported;
  }

  get lastImportedCount() {
    return this._lastImportedCount;
  }

  // END PROPS
}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit-dialog.html',
  styleUrls: ['../../../styles/dialog-styles.scss'],
})
export class EditGiftSubscriptionDialog {
  constructor(
    public dialogRef: MatDialogRef<EditGiftSubscriptionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GiftSubscription
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'create-orders-dialog',
  templateUrl: 'create-orders.html',
  styleUrls: ['../../../styles/dialog-styles.scss'],
})
export class CreateGiftSubscriptionOrdersDialog {
  constructor(
    public dialogRef: MatDialogRef<CreateGiftSubscriptionOrdersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GiftSubscription[]
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
