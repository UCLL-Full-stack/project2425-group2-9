import { Customer as customerPrisma } from "@prisma/client";
import { Cart as cartPrisma } from "@prisma/client";
import { Cart } from "./cart";


export class Customer {
    private id?: string;
    private password!: string;
    private securityQuestion!: string;
    private username!: string;
    private firstName!: string;
    private lastName!: string;
    private phone!: string;

    constructor(customer: {
        id?: string;
        password: string;
        securityQuestion: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string;
    }) {
        // TODO: Use setters!.
        this.setId(customer.id);
        this.setPassword(customer.password);
        this.setSecurityQuestion(customer.securityQuestion);
        this.setUsername(customer.username);
        this.setFirstName(customer.firstName);
        this.setLastName(customer.lastName);
        this.setPhone(customer.phone);
    }

    getId(): string|undefined {
        return this.id;
    }
    setId(newId: string|undefined): void {
        this.id = newId
    }
    getPassword(): string {
        return this.password;
    }
    setPassword(password: string): void {
        if (!password?.trim()) 
            throw new Error( "Password is required." )
        else if (password.length < 8) 
            throw new Error( "Password must contain at least 8 characters." )
        else {
            this.password = password;
        }
    }

    getSecurityQuestion(): string {
        return this.securityQuestion;
    }

    setSecurityQuestion(securityQuestion: string): void {
        if (!securityQuestion?.trim())
            throw new Error( "security question needs to be answered." )

        this.securityQuestion = securityQuestion;
    }

    getUsername(): string {
        return this.username;
    }

    setUsername(username: string): void {
        if ( !username?.trim() )
            throw new Error( "Username is required." )

        this.username = username;
    }

    getFirstName(): string {
        return this.firstName;
    }

    setFirstName(firstName: string): void {
        if ( !firstName?.trim() )
            throw new Error( "First name is required." )

        this.firstName = firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    setLastName(lastName: string): void {
        if ( !lastName?.trim() )
            throw new Error( "Last name is required." )

        this.lastName = lastName;
    }

    getPhone(): string {
        return this.phone;
    }

    setPhone(phone: string): void {
        // if ( !phone )
        //     throw new Error( "Phone number is required." )
        // else if ( phone.toString().length < 9 || phone. < 0)
        //     throw new Error( "Please enter your correct phone number")
        if (!phone?.trim()) {
            throw new Error (" phone number is required")
        }
        
        this.phone = phone
    }

    equals(customer : Customer) : Boolean {
        return (
            customer.getFirstName() === this.firstName &&
            customer.getId() === this.id &&
            customer.getLastName() === this.lastName &&
            customer.getPassword() === this.password &&
            customer.getPhone() === this.phone &&
            customer.getSecurityQuestion() === this.securityQuestion &&
            customer.getUsername() === this.username
        )
    }

    static from({

        id,
        password,
        securityQuestion,
        username,
        lastName,
        firstName,
        phone,
    }:customerPrisma ) {

        return new Customer({
            id,
            password,
            securityQuestion,
            username,
            lastName,
            firstName,
            phone,
           
        })
    }
}