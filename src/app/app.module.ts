import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeNb from '@angular/common/locales/nb';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule, MatCheckboxModule, MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';

import { AppComponent } from './app.component';
import { ProductsComponent, EditProductComponent } from './shop/components/products/products.component';
import { ProductComponent } from './shop/components/products/product/product.component';
import { BasketComponent } from './shop/components/basket/basket.component';
import { BuyProductComponent } from './shop/components/buy-product/buy-product.component';
import { BasketItemComponent } from './shop/components/basket/basket-item/basket-item.component';
import { CheckoutComponent } from './shop/components/checkout/checkout.component';
import { CheckoutPaymentComponent } from './shop/components/checkout/checkout-payment/checkout-payment.component';
import { CheckoutCustomerDetailsComponent } from './shop/components/checkout/checkout-customer-details/checkout-customer-details.component';
import { SignInComponent } from './shop/components/sign-in/sign-in.component';
import { LoaderComponent } from './shop/core/loader/loader/loader.component';
// import { LoaderInterceptor } from './core/loader-interceptor';
import { HttpStuffInterceptor } from './shop/core/http-stuff-interceptor';
import { MyAccountComponent } from './shop/components/my-account/my-account.component';
import { WpViewerComponent } from './shop/components/wp-viewer/wp-viewer.component';
import { MyDetailsComponent } from './shop/components/my-account/my-details/my-details.component';
import { MySubscriptionsComponent } from './shop/components/my-account/my-subscriptions/my-subscriptions.component';
import { MyOrdersComponent } from './shop/components/my-account/my-orders/my-orders.component';
import { MyAddressesComponent } from './shop/components/my-account/my-addresses/my-addresses.component';
import { AdminOrdersComponent } from './admin/components/admin-orders/admin-orders.component';
import { MiniBasketComponent } from './shop/components/basket/mini-basket/mini-basket.component';
import { BreadcrumbComponent } from './shop/components/breadcrumb/breadcrumb.component';
import { SubscriptionProductComponent } from './shop/components/products/subscription-product/subscription-product.component';
import { AdminComponent } from './admin/admin.component';
import { AdminSubscriptionsComponent } from './admin/components/admin-subscriptions/admin-subscriptions.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop/shop.component';
import { CustomersComponent, EditCustomerComponent } from './shop/components/customers/customers.component';
import { OrdersComponent } from './shop/components/orders/orders.component';
import { AddressComponent } from './shop/components/address/address.component';
import { OrderListComponent } from './shop/components/orders/order-list/order-list.component';
import { OrderDetailsComponent } from './shop/components/orders/order-details/order-details.component';

// the second parameter 'fr' is optional
registerLocaleData(localeNb, 'nb');

const appRoutes: Routes = [
  { path: '', redirectTo: '/backoffice/dashboard', pathMatch: 'full' },
  { path: 'backoffice/dashboard', component: DashboardComponent },
  { path: 'shop', component: ShopComponent },
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
    AdminSubscriptionsComponent,
    DashboardComponent,
    ShopComponent,
    CustomersComponent,
    EditProductComponent,
    EditCustomerComponent,
    OrdersComponent,
    AddressComponent,
    OrderListComponent,
    OrderDetailsComponent
  ],
  entryComponents: [
    EditProductComponent, EditCustomerComponent
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
    MatSelectModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatExpansionModule, MatDialogModule, MatInputModule, MatRadioModule, MatTabsModule, MatTableModule ],
  providers: [
  //  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpStuffInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'nb' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
