import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ItemComponent } from './components/item/item.component';
import { OrderComponent } from './components/order/order.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerResolver } from './service/customer/customer-resolver';
import { OrderResolver } from './service/order/order-resolver';
import { ItemResolver } from './service/item/item-resolver';
import { ItemListComponent } from './components/item-list/item-list.component';
import { OrderListComponent } from './components/order-list/order-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'order',
    component: OrderComponent,
    resolve: { order: OrderResolver },
  },
  { path: 'order-list', component: OrderListComponent },
  {
    path: 'customer',
    component: CustomerComponent,
    resolve: { customer: CustomerResolver },
  },
  { path: 'customer-list', component: CustomerListComponent },
  {
    path: 'item',
    component: ItemComponent,
    resolve: { item: ItemResolver },
  },
  { path: 'item-list', component: ItemListComponent },
];
