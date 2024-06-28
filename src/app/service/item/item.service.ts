import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from '../../components/item/item.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/item';

  public createItem(item: Item): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post<Item>(`${this.apiUrl}/createitem`, item, httpOptions);
  }

  public readItems(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiUrl}/getlist`, { params });
  }

  public readItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getlist/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  public updateItem(item: Item, id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.put<Item>(`${this.apiUrl}/updateitem/${id}`, item, httpOptions);
  }

  public deleteItem(itemId: number) {
    return this.http.delete(`${this.apiUrl}/deleteitem/${itemId}`);
  }
}
