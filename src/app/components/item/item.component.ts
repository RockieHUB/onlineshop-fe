import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemService } from '../../service/item/item.service';
import { Item } from './item.model';

@Component({
  selector: 'app-item',
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
  providers: [ItemService],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css',
})
export class ItemComponent {
  constructor(
    private itemService: ItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  item!: Item;
  isCreateItem: boolean = true;
  itemId: number = 0;
  ngOnInit(): void {
    this.item = this.activatedRoute.snapshot.data['item'];
    this.itemId = Number(
      this.activatedRoute.snapshot.paramMap.get('itemId')
    );
    console.log(this.item);

    if (
      this.item &&
      this.item.itemsName != '' &&
      this.itemId != 0
    ) {
      this.isCreateItem = false;
    }
  }

  @ViewChild('numberCheck')
  numberCheck!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    this.numberCheck.nativeElement.addEventListener(
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

  selectedFile: any = null;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  checkCondition(itemForm: NgForm) {
    if (this.isCreateItem) {
      this.createItem(itemForm);
    } else {
      this.updateItem(itemForm);
    }
  }

  createItem(ItemForm: NgForm) {
    this.itemService.createItem(this.item).subscribe({
      next: (newItem: Item) => {
        console.log('Item created:', newItem);
        ItemForm.resetForm();
        this.router.navigate(['/item-list']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateItem(itemForm: NgForm) {
    this.itemService
      .updateItem(this.item, this.itemId)
      .subscribe({
        next: (newItem: Item) => {
          console.log('Item updated:', newItem);
          itemForm.resetForm();
          this.router.navigate(['/item-list']);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  @ViewChild('itemForm') ItemForm!: NgForm;
  clearForm(itemForm: NgForm) {
    itemForm.resetForm();
  }
}
