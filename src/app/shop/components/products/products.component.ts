import { Component, OnInit, Inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCategories } from '../../constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface EditCoffeeProductData {
  code: string;
  country: string;
  name: string;
  description: string;
  tastes: string;
  priceSmallBag: number;
  pricePerKg: number;
}


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  vatCoffee = 15;

  text: string;
  coffeeProducts: Array<Product>;
  subscriptionProduct: Product;
  giftSubscriptionProduct: Product;
  editProductForm: FormGroup;

  constructor(private productService: ProductService, private fb: FormBuilder, public dialog: MatDialog) {
    this.subscriptionProduct = new Product();
    this.giftSubscriptionProduct = new Product();
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {

      this.coffeeProducts = products.filter(product => product.category === ProductCategories.coffee);
      this.subscriptionProduct = this.getFirstProductOfType(products, ProductCategories.coffeeSubscription);
      this.giftSubscriptionProduct = this.getFirstProductOfType(products, ProductCategories.coffeeGiftSubscription);

    }, err => {
      console.log('[DEBUG] Error when getting products: ' + err.status + ' ' + err.message);
    });

    this.createForms();
  }

  openEditProductDialog(product: Product): void {
    console.log(product);
    const dialogRef = this.dialog.open(EditProductComponent, {
      data: {
        code: product.data.code,
        country: product.data.country,
        name: product.data.name,
        description: product.data.description,
        tastes: product.data.tastes,
        priceSmallBag: product.priceVariations[0].price,
        pricePerKg: product.priceVariations[1].price
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      product.data.code = result.code;
      product.data.country = result.country;
      product.data.name = result.name;
      product.data.description = result.description;
      product.data.tastes = result.tastes;
      product.priceVariations[0].price = result.priceSmallBag;
      product.priceVariations[1].price = result.pricePerKg;
    });
  }

  saveProduct() {
    // todo: ...
  }

  createForms() {
    this.editProductForm = this.fb.group({
      code: ['', Validators.required],
      country: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      tastes: [''],
      priceSmallBag: [''],
      pricePerKg: [''],
      infoUrl: [''],
      portfolioImageKey: ['']
    });
  }

  getFirstProductOfType(products: Array<Product>, category: String) {
    const items = products.filter(p => p.category === category);
    return items.length > 0 ? products.filter(p => p.category === category)[0] : null;
  }

  getProductImageOrDefault(product: Product): string {
    return !product.portfolioImageKey ? 'product_default.jpg' : product.portfolioImageKey;
  }
}


@Component({
  selector: 'edit-product.component',
  templateUrl: 'edit-product.component.html',
})
export class EditProductComponent {

  constructor(
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditCoffeeProductData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}