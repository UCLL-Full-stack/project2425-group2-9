import { CartContainsProduct } from "./cartContainsProduct";
import { Customer } from "./customer";
import { Cart as cartPrisma } from "@prisma/client";
import { Customer as customerPrisma } from "@prisma/client";

export class Cart {
    private id?: string;
    private totalPrice!: number;
    private customerId?: string;
    private customer?: Customer;
    private isActive! : boolean

    constructor(cart: { id?: string, totalPrice: number, customerId?: string, customer?: Customer , isActive: boolean}) {
        this.id = cart.id
        this.setCustomerId(cart.customerId);
        this.setTotalPrice(cart.totalPrice);
        this.setCustomer(cart.customer);
        this.setIsActive(cart.isActive)
    }

    getId(): string | undefined {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getTotalPrice(): number {
        return this.totalPrice;
    }

    setTotalPrice(totalPrice: number): void {
        if (totalPrice >= 0) {
            this.totalPrice = totalPrice;
        } else {
            throw new Error("Total price must be greater than or equal to 0.");
        }
    }

    getCustomerId(): string | undefined {
        return this.customerId;
    }

    setCustomerId(customerId?: string): void {
        this.customerId = customerId;
    }

    getCustomer(): Customer | undefined {
        return this.customer;
    }
    //customer could be undefined, so need to check if the customer is defined or not.
    setCustomer(customer?: Customer): void {
        // // if (customer?.getId() !== this.getCustomerId()) {
        //     throw new Error("Customer does not match the associated customer");//had an issue while creating a new customer. 
            
        // }
        this.customer = customer;
    }

    getIsActive() : boolean {
        return this.isActive
    }

    setIsActive(value : boolean) : void {

        this.isActive = value
    }

    static from({
        id,
        totalPrice,
        customerId,
        customerPrisma,
        isActive
    }: cartPrisma & { customerPrisma?: customerPrisma }) {
        return new Cart({
            id,
            totalPrice,
            customerId: customerId ? customerId : undefined,
            customer: customerPrisma ? Customer.from(customerPrisma) : undefined,
            isActive
        });
    }
}