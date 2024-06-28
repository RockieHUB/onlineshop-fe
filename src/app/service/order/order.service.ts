import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../../components/order/order.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/order';

  public createOrder(order: Order): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.post<Order>(
      `${this.apiUrl}/createorder`,
      order,
      httpOptions
    );
  }

  public readOrders(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiUrl}/getlist`, { params });
  }

  public readOrder(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/getlist/${id}`)
      .pipe(map((response) => response.data));
  }

  public downloadReportOrder(): Observable<any> {
    return this.http.get(`${this.apiUrl}/order-report/pdf`, {
      responseType: 'blob',
    });
  }

  public updateOrder(order: Order, id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.put<Order>(
      `${this.apiUrl}/updateorder/${id}`,
      order,
      httpOptions
    );
  }

  public deleteOrder(orderId: number) {
    return this.http.delete(`${this.apiUrl}/deleteorder/${orderId}`);
  }
}
