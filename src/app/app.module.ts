import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeNb from '@angular/common/locales/nb';

import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

import {MatSelectModule, MatCheckboxModule, MatInputModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

import { AppComponent } from './app.component';

import { ProductsComponent, EditProductComponent } from './shop/components/products/products.component';

import { OrdersComponent } from './shop/components/orders/orders.component';
import { OrderListComponent, AddOrderNoteComponent } from './shop/components/orders/order-list/order-list.component';
import { OrderDetailsComponent } from './shop/components/orders/order-details/order-details.component';
import { AddressComponent } from './shop/components/address/address.component';

import { SignInComponent } from './shop/components/sign-in/sign-in.component';
import { LoaderComponent } from './shop/core/loader/loader/loader.component';
import { HttpStuffInterceptor } from './shop/core/http-stuff-interceptor';
import { MyAccountComponent } from './shop/components/my-account/my-account.component';
import { MyDetailsComponent } from './shop/components/my-account/my-details/my-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop/shop.component';
import { AmountFieldComponent } from './shop/components/util/amount-field/amount-field.component';
import { GiftSubscriptionsComponent } from './shop/components/gift-subscriptions/gift-subscriptions.component';
import { GiftSubscriptionDetailsComponent } from './shop/components/gift-subscriptions/gift-subscription-details/gift-subscription-details.component';


// the second parameter 'fr' is optional
registerLocaleData(localeNb, 'nb');

const appRoutes: Routes = [
  { path: '', redirectTo: '/backoffice/dashboard', pathMatch: 'full' },
  { path: 'backoffice/dashboard', component: DashboardComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'account', component: MyAccountComponent }
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
    ShopComponent,
    EditProductComponent,
    OrdersComponent,
    AddressComponent,
    OrderListComponent,
    OrderDetailsComponent,
    AddOrderNoteComponent,
    AmountFieldComponent,
    GiftSubscriptionsComponent,
    GiftSubscriptionDetailsComponent
  ],
  entryComponents: [
    EditProductComponent, AddOrderNoteComponent
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
    MatSelectModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatExpansionModule, MatDialogModule, MatInputModule, MatRadioModule, MatTabsModule, MatTableModule, MatDatepickerModule, MatMomentDateModule ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpStuffInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'nb' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
