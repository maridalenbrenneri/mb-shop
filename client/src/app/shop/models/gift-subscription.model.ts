import { Address } from './address.model';

export interface GiftSubscription {
  id: number;
  wooOrderId: number;
  wooOrderNumber: number;
  status: string;
  orderDate: number;
  originalFirstDeliveryDate: Date;
  numberOfMonths: number;
  firstDeliveryDate: Date;
  lastDeliveryDate: Date;
  quantity: number;
  frequence: number;
  recipient_name: string;
  recipient_email: string;
  recipient_address: Address;
  message_to_recipient: string;
  note: string;
  lastOrderCreated: Date;
}
