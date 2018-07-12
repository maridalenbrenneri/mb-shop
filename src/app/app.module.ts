import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductComponent } from './components/product/product.component';
import { BasketComponent } from './components/basket/basket.component';
import { BuyProductComponent } from './components/buy-product/buy-product.component';
import { BasketItemComponent } from './components/basket-item/basket-item.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { CheckoutCustomerDetailsComponent } from './components/checkout-customer-details/checkout-customer-details.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/product-list', pathMatch: 'full' },
  { path: 'product/:id', component: ProductComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'checkout', component: CheckoutComponent }
 // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductComponent,
    BasketComponent,
    BuyProductComponent,
    BasketItemComponent,
    CheckoutComponent,
    CheckoutPaymentComponent,
    CheckoutCustomerDetailsComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
