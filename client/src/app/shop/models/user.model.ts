export class User {
    id: number;
    role: string;
    email: string;
    password: string;
    customerId: number;
}

export class RegisterUserModel {
    role: string;
    email: string;
    password: string;
    confirmPassword: string;
}
