import { Component, Inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../service/order/order.service';
import { Order } from '../order/order.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatIconModule,
    RouterModule,
    MatPaginatorModule,
    CommonModule,
  ],
  providers: [OrderService],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent {
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  order!: Order;
  ngOnInit(): void {
    this.order = {
      orderCode: '',
      totalPrice: 0,
      quantity: 0,
      items: {
        itemsId: 0,
        itemsName: '',
        itemsCode: '',
        stock: 0,
        price: 0,
        isAvailable: false,
      },
      customers: {
        customerId: 0,
        customerName: '',
        customerAddress: '',
        customerPhone: '',
        isActive: false,
        lastOrderDate: new Date(),
        pic: null,
      },
    };
    this.readOrder(0, 10);
  }

  displayedColumns: string[] = [
    // 'orderId',
    'orderCode',
    'orderDate',
    'totalPrice',
    // 'itemsName',
    // 'customerName',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      const pageIndex = event.pageIndex;
      const pageSize = event.pageSize;
      this.paginator.length = this.total_data;
      this.readOrder(pageIndex, pageSize); // Load data based on page changes
    });
  }
  total_data : number = 0;
  readOrder(pageIndex: number, pageSize: number) {
    this.orderService.readOrders(pageIndex, pageSize).subscribe({
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

  downloadOrderReport() {
    this.orderService.downloadReportOrder().subscribe({
      next: (response: Blob) => {
        saveAs(response, 'order_report.pdf'); // Use file-saver to save the Blob
      },
      error: (error) => {
        console.error('Error downloading order report:', error);
        // Handle the error appropriately (e.g., display an error message to the user)
      },
    });
  }

  updateOrder(orderId: number): void {
    console.log('Update Order ID:' + orderId);
    this.router.navigate(['/order', { orderId: orderId }]);
  }

  deleteOrder(orderId: number): void {
    console.log('Delete Order ID:' + orderId);
    this.orderService.deleteOrder(orderId).subscribe({
      next: (res) => {
        console.log(res);

        // Recalculate pageIndex if necessary after deleting an order on the last page
        const lastPageIndex =
          Math.ceil(this.paginator.length / this.paginator.pageSize) - 1;
        const newPageIndex =
          this.paginator.pageIndex > lastPageIndex
            ? lastPageIndex
            : this.paginator.pageIndex;

        this.readOrder(newPageIndex, this.paginator.pageSize);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openDialog(orderId: number) {
    const order = this.dataSource.data.find((o: any) => o.orderId === orderId);

    if (order) {
      this.dialog.open(OrderDetailDialogComponent, {
        data: order,
      });
    } else {
      console.error('Order not found');
    }
  }
}

// Dialog Component
@Component({
  selector: 'order-list-dialog-details',
  templateUrl: 'order-list-dialog-details.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, CommonModule],
})
export class OrderDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
