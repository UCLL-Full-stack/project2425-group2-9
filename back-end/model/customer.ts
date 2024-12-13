import { Customer as customerPrisma, Role } from "@prisma/client";
// import { Role as PrismaRole } from '@prisma/client';



export class Customer {
    private id?: string;
    private password!: string;
    private username!: string;
    private firstName!: string;
    private lastName!: string;
    private phone!: string;
    private role?: Role;

    constructor(customer: {
        id?: string;
        password: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string;
        role?: Role;
    }) {
        this.setId(customer.id);
        this.setPassword(customer.password);
        this.setUsername(customer.username);
        this.setFirstName(customer.firstName);
        this.setLastName(customer.lastName);
        this.setPhone(customer.phone);
        this.setRole(customer.role);
    }

    getId(): string | undefined {
        return this.id;
    }

    setId(newId: string | undefined): void {
        this.id = newId;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        if (!password?.trim()) 
            throw new Error("Password is required.");
        else if (password.length < 8) 
            throw new Error("Password must contain at least 8 characters.");
        else {
            this.password = password;
        }
    }

    getUsername(): string {
        return this.username;
    }

    setUsername(username: string): void {
        if (!username?.trim())
            throw new Error("Username is required.");

        this.username = username;
    }

    getFirstName(): string {
        return this.firstName;
    }

    setFirstName(firstName: string): void {
        if (!firstName?.trim())
            throw new Error("First name is required.");

        this.firstName = firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    setLastName(lastName: string): void {
        if (!lastName?.trim())
            throw new Error("Last name is required.");

        this.lastName = lastName;
    }

    getPhone(): string {
        return this.phone;
    }

    setPhone(phone: string): void {
        if (!phone?.trim())  throw new Error("Phone number is required");
        
        //max length is 12 because in situation where the customer uses a +
        if (phone.split(" ").join("").replace('+','').length < 8  || 

        phone.split(" ").join("").replace('+','').length > 12)
             throw new Error("phone number should be between 8 and 11 characters long. example: 02 345 67 89 or +32 470 12 34 56")
        
        this.phone = phone;
    }

    getRole(): Role | undefined {
        return this.role;
    }

    setRole(role?: Role): void {
        if (!role)
            role = "ADMIN"
        this.role = role
    }

    equals(customer: Customer): boolean {
        return (
            customer.getFirstName() === this.firstName &&
            customer.getId() === this.id &&
            customer.getLastName() === this.lastName &&
            customer.getPassword() === this.password &&
            customer.getPhone() === this.phone &&
            customer.getUsername() === this.username &&
            customer.getRole() === this.role
        );
    }

    static from({
        id,
        password,
        username,
        lastName,
        firstName,
        phone,
        role
    }: customerPrisma): Customer {
        return new Customer({
            id,
            password,
            username,
            lastName,
            firstName,
            phone,
            role: role as Role
        });
    }
}