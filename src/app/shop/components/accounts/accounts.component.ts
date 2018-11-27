import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  editAccountForm: FormGroup;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {

  }

  openEditAccountDialog(user: User): void {
    if(!user) {
      user = new User();
      user.name = '';
    }

    const dialogRef = this.dialog.open(EditAccounComponent, {
      disableClose: true,
      data: {
        name: user.name,
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log(result);

      if(!result) {
        return;
      }

    });
  }

}

export interface EditAccountData {
  code: string;
  country: string;
  name: string;
  description: string;
  tastes: string;
  priceSmallBag: number;
  pricePerKg: number;
}

@Component({
  selector: 'edit-account.component',
  templateUrl: 'edit-account.component.html',
})
export class EditAccounComponent {

  editAccountForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditAccounComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: EditAccountData) {}

  ngOnInit() {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.editAccountForm = this.fb.group({
      name: ['', Validators.required],
      organizationNumber: ['', Validators.required],
      email: ['', Validators.required],
      mobile: [''],
      contactPerson: [''],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
  }

}
