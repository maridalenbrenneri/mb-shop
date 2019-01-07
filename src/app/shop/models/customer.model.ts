import { Address } from "./address.model";

export class Customer {
    constructor() {
        this.address = new Address();
    }
    customerNumber: number;
    email: string;
    phone: string;
    name: string;
    organizationNumber: string;
    contactPerson: string;
    address: Address;
}