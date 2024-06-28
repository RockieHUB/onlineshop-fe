import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../service/order/order.service';
import { Order } from './order.model';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
  ],
  providers: [OrderService],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {
  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  order!: Order;
  isCreateOrder: boolean = true;
  orderId: number = 0;
  ngOnInit(): void {
    this.order = this.activatedRoute.snapshot.data['order'];
    this.orderId = Number(this.activatedRoute.snapshot.paramMap.get('orderId'));
    console.log(this.order);

    if (this.order && this.orderId != 0) {
      this.isCreateOrder = false;
    }
  }

  @ViewChild('numberCheck')
  numberCheck!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    this.numberCheck.nativeElement.addEventListener('input', (event: any) => {
      const initialValue = event.target.value;
      const newValue = initialValue.replace(/[^0-9\-]/g, '');
      if (initialValue !== newValue) {
        event.target.value = newValue;
        // Optionally, trigger change detection or form validation
      }
    });
  }

  selectedFile: any = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  checkCondition(orderForm: NgForm) {
    if (this.isCreateOrder) {
      this.createOrder(orderForm);
    } else {
      this.updateOrder(orderForm);
    }
  }

  createOrder(orderForm: NgForm) {
    this.orderService.createOrder(this.order).subscribe({
      next: (newOrder: Order) => {
        console.log('Order created:', newOrder);
        orderForm.resetForm();
        this.router.navigate(['/order-list']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateOrder(orderForm: NgForm) {
    this.orderService.updateOrder(this.order, this.orderId).subscribe({
      next: (newOrder: Order) => {
        console.log('Order updated:', newOrder);
        orderForm.resetForm();
        this.router.navigate(['/order-list']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  @ViewChild('orderForm') orderForm!: NgForm;
  clearForm(orderForm: NgForm) {
    orderForm.resetForm();
  }
}
