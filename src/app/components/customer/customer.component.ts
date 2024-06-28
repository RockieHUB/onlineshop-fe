import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Customer } from './customer.model';
import { CustomerService } from '../../service/customer/customer.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
  ],
  providers: [CustomerService],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  constructor(
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  customer!: Customer;
  isCreateCustomer: boolean = true;
  customerId: number = 0;
  ngOnInit(): void {
    this.customer = this.activatedRoute.snapshot.data['customer'];
    this.customerId = Number(
      this.activatedRoute.snapshot.paramMap.get('customerId')
    );
    console.log(this.customer);

    if (
      this.customer &&
      this.customer.customerName != '' &&
      this.customerId != 0
    ) {
      this.isCreateCustomer = false;
    }
  }

  @ViewChild('phoneNumberInput')
  phoneNumberInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    this.phoneNumberInput.nativeElement.addEventListener(
      'input',
      (event: any) => {
        const initialValue = event.target.value;
        const newValue = initialValue.replace(/[^0-9\-]/g, '');
        if (initialValue !== newValue) {
          event.target.value = newValue;
          // Optionally, trigger change detection or form validation
        }
      }
    );
  }

  selectedFile: File | null = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  checkCondition(customerForm: NgForm) {
    if (this.isCreateCustomer) {
      this.createCustomer(customerForm);
    } else {
      this.updateCustomer(customerForm);
    }
  }

  createCustomer(customerForm: NgForm) {
    if (this.selectedFile) {
      // Check if a file was selected
      this.customerService
        .createCustomer(this.customer, this.selectedFile)
        .subscribe({
          next: (newCustomer: Customer) => {
            console.log('Customer created:', newCustomer);
            customerForm.resetForm();
            this.router.navigate(['/customer-list']);
          },
          error: (error) => {
            console.error(error);
          },
        });
    } else {
      // Handle the case where no file is selected (e.g., display an error message)
    }
  }

  updateCustomer(customerForm: NgForm) {
    this.customerService
      .updateCustomer(this.customer, this.customerId)
      .subscribe({
        next: (newCustomer: Customer) => {
          console.log('Customer updated:', newCustomer);
          customerForm.resetForm();
          this.router.navigate(['/customer-list']);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  @ViewChild('customerForm') customerForm!: NgForm;
  clearForm(customerForm: NgForm) {
    customerForm.resetForm();
  }
}
