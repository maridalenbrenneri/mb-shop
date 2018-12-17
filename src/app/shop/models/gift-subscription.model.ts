import { Address } from './address.model';

export interface GiftSubscription {
    id: number;
    wooOrderId: number;
    status: string;
    orderDate: number;
    numerOfMonths: number;
    firstDeliveryDate: Date;
    lastDeliveryDate: Date;
    quantity: number;
    frequence: string,
    recipent_name: string;
    recipent_email: string;
    recipent_address: Address;
    message_to_recipient: string;
    note: string;
}
