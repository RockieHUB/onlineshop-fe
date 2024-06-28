import { Component, Inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { ItemService } from '../../service/item/item.service';
import { Item } from '../item/item.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatIconModule,
    RouterModule,
    MatPaginatorModule,
    CommonModule,
  ],
  providers: [ItemService],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent {
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(
    private itemService: ItemService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  item!: Item;
  ngOnInit(): void {
    this.item = {
      itemsName: '',
      itemsCode: '',
      price: 0,
      stock: 0,
      isAvailable: true,
    };
    this.readItem(0, 10);
  }

  displayedColumns: string[] = [
    // 'itemsId',
    'itemsName',
    // 'itemsCode',
    // 'stock',
    'price',
    // 'isAvailable',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      const pageIndex = event.pageIndex;
      const pageSize = event.pageSize;
      this.paginator.length = this.total_data;
      this.readItem(pageIndex, pageSize); // Load data based on page changes
    });
  }
  total_data: number = 0;
  readItem(pageIndex: number, pageSize: number) {
    this.itemService.readItems(pageIndex, pageSize).subscribe({
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

  updateItem(itemId: number): void {
    console.log('Update item ID:' + itemId);
    this.router.navigate(['/item', { itemId: itemId }]);
  }

  deleteitem(itemId: number): void {
    console.log('Delete item ID:' + itemId);
    this.itemService.deleteItem(itemId).subscribe({
      next: (res) => {
        console.log(res);

        // Recalculate pageIndex if necessary after deleting an order on the last page
        const lastPageIndex =
          Math.ceil(this.paginator.length / this.paginator.pageSize) - 1;
        const newPageIndex =
          this.paginator.pageIndex > lastPageIndex
            ? lastPageIndex
            : this.paginator.pageIndex;

        this.readItem(newPageIndex, this.paginator.pageSize);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openDialog(itemsId: number) {
    const item = this.dataSource.data.find((o: any) => o.itemsId === itemsId);

    if (item) {
      this.dialog.open(ItemDetailDialogComponent, {
        data: item,
      });
    } else {
      console.error('Item not found');
    }
  }
}

// Dialog Component
@Component({
  selector: 'item-list-dialog-details',
  templateUrl: 'item-list-dialog-details.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, CommonModule, MatCardModule],
  styleUrl: './item-list.component.css',
})
export class ItemDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
