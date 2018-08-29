import { User } from './user.model';

export class Subscription {
    id: number;
    parentOrderId: number;
    customer: User;
    frequency: number;
    quantity: number;
    status: string;
    firstDeliveryDate: Date;
    lastDeliveryDate: Date;
    endDate: Date;
    isGiftSubscription: boolean;
}
