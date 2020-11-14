import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeNb from '@angular/common/locales/nb';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
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

import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AppComponent } from './app.component';

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
import {
  CreateGiftSubscriptionOrdersDialog,
  EditGiftSubscriptionDialog,
  GiftSubscriptionsComponent,
} from './shop/components/gift-subscriptions/gift-subscriptions.component';
import { GiftSubscriptionDetailsComponent } from './shop/components/gift-subscriptions/gift-subscription-details/gift-subscription-details.component';
import { OrderEditComponent } from './shop/components/orders/order-edit/order-edit.component';
import {
  CoffeesComponent,
  EditCoffeeComponent,
} from './shop/components/coffees/coffees.component';
import {
  DeliveryDaysComponent,
  EditDeliveryDayComponent,
} from './shop/components/delivery-days/delivery-days.component';
import {
  SubscriptionsComponent,
  EditSubscriptionComponent,
} from './shop/components/subscriptions/subscriptions.component';

// the second parameter 'fr' is optional
registerLocaleData(localeNb, 'nb');

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'shop', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'gift-subscriptions', component: GiftSubscriptionsComponent },
  { path: 'delivery-days', component: DeliveryDaysComponent },
  { path: 'coffees', component: CoffeesComponent },
  { path: 'subscriptions', component: SubscriptionsComponent },
  { path: 'my-account', component: MyAccountComponent },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CoffeesComponent,
    SignInComponent,
    LoaderComponent,
    MyAccountComponent,
    MyDetailsComponent,
    DashboardComponent,
    EditCoffeeComponent,
    OrdersComponent,
    AddressComponent,
    OrderListComponent,
    OrderDetailsComponent,
    AmountFieldComponent,
    GiftSubscriptionsComponent,
    GiftSubscriptionDetailsComponent,
    OrderEditComponent,
    DeliveryDaysComponent,
    EditDeliveryDayComponent,
    SubscriptionsComponent,
    EditSubscriptionComponent,
    EditGiftSubscriptionDialog,
    CreateGiftSubscriptionOrdersDialog,
  ],
  entryComponents: [
    OrderEditComponent,
    EditCoffeeComponent,
    EditDeliveryDayComponent,
    EditSubscriptionComponent,
    EditGiftSubscriptionDialog,
    CreateGiftSubscriptionOrdersDialog,
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
    CommonModule,
    ToastrModule.forRoot(),
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule,
    MatTableModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatMenuModule,
    MatIconModule,
    NgxJsonViewerModule,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpStuffInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'nb' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
