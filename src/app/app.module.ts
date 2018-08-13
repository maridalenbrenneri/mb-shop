import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductComponent } from './components/product/product.component';
import { BasketComponent } from './components/basket/basket.component';
import { BuyProductComponent } from './components/buy-product/buy-product.component';
import { BasketItemComponent } from './components/basket-item/basket-item.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { CheckoutCustomerDetailsComponent } from './components/checkout-customer-details/checkout-customer-details.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { LoaderComponent } from './core/loader/loader/loader.component';
import { LoaderInterceptor } from './core/loader-interceptor';
import { TokenInterceptor } from './core/token-interceptor';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { WpViewerComponent } from './components/wp-viewer/wp-viewer.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { MyDetailsComponent } from './components/my-account/my-details/my-details.component';
import { MySubscriptionsComponent } from './components/my-account/my-subscriptions/my-subscriptions.component';
import { MyOrdersComponent } from './components/my-account/my-orders/my-orders.component';
import { MyAddressesComponent } from './components/my-account/my-addresses/my-addresses.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'about', component: WpViewerComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'account', component: MyAccountComponent }
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
    CheckoutCustomerDetailsComponent,
    SignInComponent,
    LoaderComponent,
    MyAccountComponent,
    WpViewerComponent,
    RegisterUserComponent,
    MyDetailsComponent,
    MySubscriptionsComponent,
    MyOrdersComponent,
    MyAddressesComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
