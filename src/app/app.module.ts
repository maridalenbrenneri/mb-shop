import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeNb from '@angular/common/locales/nb';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule, MatCheckboxModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

import { AppComponent } from './app.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/products/product/product.component';
import { BasketComponent } from './components/basket/basket.component';
import { BuyProductComponent } from './components/buy-product/buy-product.component';
import { BasketItemComponent } from './components/basket/basket-item/basket-item.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { CheckoutPaymentComponent } from './components/checkout/checkout-payment/checkout-payment.component';
import { CheckoutCustomerDetailsComponent } from './components/checkout/checkout-customer-details/checkout-customer-details.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { LoaderComponent } from './core/loader/loader/loader.component';
// import { LoaderInterceptor } from './core/loader-interceptor';
import { HttpStuffInterceptor } from './core/http-stuff-interceptor';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { WpViewerComponent } from './components/wp-viewer/wp-viewer.component';
import { MyDetailsComponent } from './components/my-account/my-details/my-details.component';
import { MySubscriptionsComponent } from './components/my-account/my-subscriptions/my-subscriptions.component';
import { MyOrdersComponent } from './components/my-account/my-orders/my-orders.component';
import { MyAddressesComponent } from './components/my-account/my-addresses/my-addresses.component';
import { AdminOrdersComponent } from './admin/components/admin-orders/admin-orders.component';
import { MiniBasketComponent } from './components/basket/mini-basket/mini-basket.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SubscriptionProductComponent } from './components/products/subscription-product/subscription-product.component';
import { AdminComponent } from './admin/admin.component';
import { AdminSubscriptionsComponent } from './admin/components/admin-subscriptions/admin-subscriptions.component';

// the second parameter 'fr' is optional
registerLocaleData(localeNb, 'nb');

const appRoutes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'about', component: WpViewerComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'account', component: MyAccountComponent },
  { path: 'admin', component: AdminComponent }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
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
    MyDetailsComponent,
    MySubscriptionsComponent,
    MyOrdersComponent,
    MyAddressesComponent,
    AdminOrdersComponent,
    MiniBasketComponent,
    BreadcrumbComponent,
    SubscriptionProductComponent,
    AdminComponent,
    AdminSubscriptionsComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatExpansionModule
  ],
  providers: [
  //  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpStuffInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'nb' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
