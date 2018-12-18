import { Address } from './address.model';

export interface GiftSubscription {
    id: number;
    wooOrderId: number;
    wooOrderNumber: number;
    status: string;
    orderDate: number;
    numerOfMonths: number;
    firstDeliveryDate: Date;
    lastDeliveryDate: Date;
    quantity: number;
    frequence: string,
    recipient_name: string;
    recipient_email: string;
    recipient_address: Address;
    message_to_recipient: string;
    note: string;
}
