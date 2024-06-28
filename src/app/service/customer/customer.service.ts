import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Customer } from '../../components/customer/customer.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/customer';

  public createCustomer(customer: Customer, file: File): Observable<any> {
    const formData = new FormData();
    formData.append(
      'customer',
      new Blob([JSON.stringify(customer)], {
        type: 'application/json',
      })
    );
    formData.append('file', file);

    return this.http.post<Customer>(`${this.apiUrl}/createcustomer`, formData);
  }

  public readCustomers(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.apiUrl}/getlist`, { params });
  }

  public readCustomer(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/getlist/${id}`)
      .pipe(map((response) => response.data));
  }

  public updateCustomer(customer: Customer, id: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.put<Customer>(
      `${this.apiUrl}/updatecustomer/${id}`,
      customer,
      httpOptions
    );
  }

  public deleteCustomer(customerId: number) {
    return this.http.delete(`${this.apiUrl}/deletecustomer/${customerId}`);
  }
}
