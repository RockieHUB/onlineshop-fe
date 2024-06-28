import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { OrderService } from './order.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../../components/order/order.model';

export const OrderResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  orderService: OrderService = inject(OrderService)
): Observable<Order> => {
  const OrderId = route.paramMap.get('OrderId');

  if (OrderId) {
    // make api call and get data for given employee id
    return orderService.readOrder(Number(OrderId));
  } else {
    // create and return empty employee details
    const Order: Order = {
      orderCode: '',
      totalPrice: 0,
      quantity: 0,
      items: {
        itemsId: 0,
        itemsName: '',
        itemsCode: '',
        stock: 0,
        price: 0,
        isAvailable: false
      },
      customers: {
        customerId: 0,
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        isActive: false,
        lastOrderDate: new Date(),
        pic: null
      },
    };

    return of(Order);
  }
};
