import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeNb from '@angular/common/locales/nb';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

import { MatSelectModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';

import { ProductsComponent, EditProductComponent } from './shop/components/products/products.component';

import { OrdersComponent } from './shop/components/orders/orders.component';
import { OrderListComponent } from './shop/components/orders/order-list/order-list.component';
import { OrderDetailsComponent } from './shop/components/orders/order-details/order-details.component';
import { AddressComponent } from './shop/components/address/address.component';

import { SignInComponent } from './shop/components/sign-in/sign-in.component';
import { LoaderComponent } from './shop/core/loader/loader/loader.component';
import { HttpStuffInterceptor } from './shop/core/http-stuff-interceptor';
import { MyAccountComponent } from './shop/components/my-account/my-account.component';
import { MyDetailsComponent } from './shop/components/my-account/my-details/my-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AmountFieldComponent } from './shop/components/util/amount-field/amount-field.component';
import { GiftSubscriptionsComponent } from './shop/components/gift-subscriptions/gift-subscriptions.component';
import { GiftSubscriptionDetailsComponent } from './shop/components/gift-subscriptions/gift-subscription-details/gift-subscription-details.component';
import { OrderEditComponent } from './shop/components/orders/order-edit/order-edit.component';


// the second parameter 'fr' is optional
registerLocaleData(localeNb, 'nb');

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'shop', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'gift-subscriptions', component: GiftSubscriptionsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'my-account', component: MyAccountComponent }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    SignInComponent,
    LoaderComponent,
    MyAccountComponent,
    MyDetailsComponent,
    DashboardComponent,
    EditProductComponent,
    OrdersComponent,
    AddressComponent,
    OrderListComponent,
    OrderDetailsComponent,
    AmountFieldComponent,
    GiftSubscriptionsComponent,
    GiftSubscriptionDetailsComponent,
    OrderEditComponent,
  ],
  entryComponents: [
    EditProductComponent, OrderEditComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes, { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    MatSelectModule, MatCheckboxModule, MatCardModule, MatButtonModule,
    MatExpansionModule, MatDialogModule, MatInputModule, MatRadioModule,
    MatTabsModule, MatTableModule, MatDatepickerModule, MatMomentDateModule,
    MatMenuModule, MatIconModule],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpStuffInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'nb' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
