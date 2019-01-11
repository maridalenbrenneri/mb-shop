import { Component, OnInit, Inject } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCategories } from '../../../constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ToastrService } from 'ngx-toastr';

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

  private _showNotActiveProducts: boolean = false;

  constructor(private productService: ProductService, public dialog: MatDialog, private toastr: ToastrService) {
    this.subscriptionProduct = new Product();
    this.giftSubscriptionProduct = new Product();
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.coffeeProducts = products.filter(product => product.category === ProductCategories.coffee);

      if(!this._showNotActiveProducts) {
        this.coffeeProducts = this.coffeeProducts.filter(product => product.isActive);
      }

    }, () => {
      this.toastr.error("Error when loading products");
    });
  }

  openEditProductDialog(product: Product): void {
    if(!product) {
      product = new Product();
      product.data = { }
      product.productVariations = [
        { name: 'priceSmallBag', price: 70, weight: 250 },
        { name: 'pricePerKg', price: 280, weight: 1000 }
      ]
    }

    const dialogRef = this.dialog.open(EditProductComponent, {
      disableClose: true,
      data: {
        code: product.data.code,
        country: product.data.country,
        name: product.data.name,
        description: product.data.description,
        tastes: product.data.tastes,
        priceSmallBag: product.productVariations[0].price,
        pricePerKg: product.productVariations[1].price
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        return;
      }

      product.category = ProductCategories.coffee;
      product.vatGroup = 'coffee';
      product.isActive = true;
      product.isInStock = true;

      product.data.code = result.code;
      product.data.country = result.country;
      product.data.name = result.name;
      product.data.description = result.description;
      product.data.tastes = result.tastes;
      product.productVariations[0].price = result.priceSmallBag;
      product.productVariations[1].price = result.pricePerKg;

      if(!this.alreadyContainsProduct(product)) {
        this.productService.createProduct(product).subscribe(() => {
          this.loadProducts();
          this.toastr.success("Product created");

        }, err => {
          this.toastr.error("Error when creating product");
        });
      
      } else {
        this.productService.updateProduct(product).subscribe(() => {
          this.loadProducts();
          this.toastr.success("Product updated");

        }, err => {
          this.toastr.error("Error when updating product");
        });
      }
    });
  }

  toggleIsActive(product: Product, active: boolean) {
    product.isActive = active;
    this.productService.updateProduct(product).subscribe(() => {
      this.loadProducts();

    }, err => {
      this.toastr.error("Error when updating product");
    });
  }

  set showNotActiveProducts(show: boolean) {
    this._showNotActiveProducts = show;
    this.loadProducts();
  }

  alreadyContainsProduct(product: Product) {
    const items = this.coffeeProducts.filter(p => p.id && p.id  === product.id);
    return items.length > 0;
  }

  getFirstProductOfType(products: Array<Product>, category: String) {
    const items = products.filter(p => p.category === category);
    return items.length > 0 ? products.filter(p => p.category === category)[0] : null;
  }

  getProductImageOrDefault(product: Product): string {
    return !product.portfolioImageKey ? 'product_default.jpg' : product.portfolioImageKey;
  }
}

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
