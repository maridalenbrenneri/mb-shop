export class Subscription {
  id: number;
  customerId: string;
  customerName: string;
  frequence: string;
  quantityKg: string; // TODO: obsolete
  quantity250: number;
  quantity500: number;
  quantity1200: number;
  status: string;
  lastOrderId: number;
  lastOrderDate: Date;
  note: string;
}
