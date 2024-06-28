import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { CustomerService } from './customer.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../../components/customer/customer.model';

export const CustomerResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  customerService: CustomerService = inject(CustomerService)
): Observable<Customer> => {
  const customerId = route.paramMap.get('customerId');

  if (customerId) {
    // make api call and get data for given employee id
    return customerService.readCustomer(Number(customerId));
  } else {
    // create and return empty employee details
    const customer: Customer = {
      customerName: '',
      customerAddress: '',
      customerPhone: '',
      isActive: false,
    };

    return of(customer);
  }
};
