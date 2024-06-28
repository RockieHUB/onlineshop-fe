import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ItemService } from './item.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from '../../components/item/item.model';

export const ItemResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  itemService: ItemService = inject(ItemService)
): Observable<Item> => {
  const itemId = route.paramMap.get('itemId');

  if (itemId) {
    // make api call and get data for given employee id
    return itemService.readItem(Number(itemId));
  } else {
    // create and return empty employee details
    const item: Item = {
      itemsName: '',
      itemsCode: '',
      price: 0,
      stock: 0,
      isAvailable: false,
    };

    return of(item);
  }
};
