import { Component, Inject, ViewChild } from '@angular/core';
import { CustomerService } from '../../service/customer/customer.service';
import { Customer } from '../customer/customer.model';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatIconModule,
    RouterModule,
    MatPaginatorModule,
    CommonModule,
  ],
  providers: [CustomerService],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css',
})
export class CustomerListComponent {
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  customer!: Customer;
  ngOnInit(): void {
    this.customer = {
      customerName: '',
      customerAddress: '',
      customerPhone: '',
      isActive: true,
    };
    this.readCustomer(0, 10);
  }

  displayedColumns: string[] = [
    // 'customerId',
    'customerName',
    'customerAddress',
    'customerPhone',
    // 'isActive',
    // 'lastOrderDate',
    // 'pic',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      const pageIndex = event.pageIndex;
      const pageSize = event.pageSize;
      this.paginator.length = this.total_data;
      this.readCustomer(pageIndex, pageSize); // Load data based on page changes
    });
  }
  total_data: number = 0;
  readCustomer(pageIndex: number, pageSize: number) {
    this.customerService.readCustomers(pageIndex, pageSize).subscribe({
      next: (res) => {
        const { data } = res;
        this.dataSource.data = data;
        this.total_data = res.total_data;
        if (this.paginator) {
          this.paginator.length = this.total_data;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateCustomer(customerId: number): void {
    console.log('Update Customer ID:' + customerId);
    this.router.navigate(['/customer', { customerId: customerId }]);
  }

  deleteCustomer(customerId: number): void {
    console.log('Delete Customer ID:' + customerId);
    this.customerService.deleteCustomer(customerId).subscribe({
      next: (res) => {
        console.log(res);

        // Recalculate pageIndex if necessary after deleting an order on the last page
        const lastPageIndex =
          Math.ceil(this.paginator.length / this.paginator.pageSize) - 1;
        const newPageIndex =
          this.paginator.pageIndex > lastPageIndex
            ? lastPageIndex
            : this.paginator.pageIndex;

        this.readCustomer(newPageIndex, this.paginator.pageSize);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openDialog(customerId: number) {
    const customer = this.dataSource.data.find(
      (o: any) => o.customerId === customerId
    );

    if (customer) {
      this.dialog.open(CustomerDetailDialogComponent, {
        data: customer,
      });
    } else {
      console.error('Customer not found');
    }
  }
}

// Dialog Component
@Component({
  selector: 'customer-list-dialog-details',
  templateUrl: 'customer-list-dialog-details.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, CommonModule, MatCardModule],
  styleUrl: './customer-list.component.css'
})
export class CustomerDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  isImageUrl(url: string): boolean {
    // Simple check if the string starts with 'http://' or 'https://'
    return url.startsWith('http://') || url.startsWith('https://');
  }
}
