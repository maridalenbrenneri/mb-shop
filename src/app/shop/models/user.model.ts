export class User {
    id: number;
    role: string;
    email: string;
    phone: string;
    name: string;
    organizationNumber: string;
    contactPerson: string;
}

export class RegisterUserModel {
    id: number;
    email: string;
    phone: string;
    name: string;
    organizationNumber: string;
    contactPerson: string;
    password: string;
}
