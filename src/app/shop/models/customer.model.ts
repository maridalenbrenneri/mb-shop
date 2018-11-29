import { Address } from "./address.model";

export class Customer {
    constructor() {
        this.deliveryAddress = new Address();
        this.invoiceAddress = new Address();
    }
    id: number;
    email: string;
    phone: string;
    name: string;
    organizationNumber: string;
    contactPerson: string;
    deliveryAddress: Address;
    invoiceAddress: Address;
    note: string;
    type: string;
}