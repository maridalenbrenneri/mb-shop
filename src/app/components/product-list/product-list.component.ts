import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  text: string;
  products: Array<Product>;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products = this.productService.getAllProducts();
  }

}
