interface Items {
  itemsId: number;
  itemsName: string;
  itemsCode: string;
  stock: number;
  price: number;
  isAvailable: boolean;
}

interface Customers {
  customerId: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  isActive: boolean;
  lastOrderDate: Date;
  pic: any;
}

export interface Order {
  orderCode: string;
  totalPrice: number;
  quantity: number;
  items: Items;
  customers: Customers;
}
