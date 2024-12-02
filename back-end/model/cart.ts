import { CartContainsProduct } from "./cartContainsProduct";
import { Customer } from "./customer";
import { Cart as cartPrisma } from "@prisma/client";
import { Customer as customerPrisma } from "@prisma/client"

export class Cart {
    private id?: string;
    private totalPrice!: number;
    private customerId?: string;
    private customer?: Customer

    // Q& Is it not better to use setters immediately in the constructor?
    //I also thought of the same thing. I thing we could
    //do we need any extra logic for setId methods in the classes?

    constructor(cart: { id?: string, totalPrice: number, customerId?: string, customer?:Customer }) {
        this.setId(cart.id);
        this.setCustomerId(cart.customerId);
        this.setTotalPrice(cart.totalPrice)
        this.setCustomer(cart.customer)
    }

    getId(): string|undefined {
        return this.id;
    }

    setId(id: string|undefined): void {

        this.id = id;
    }

    getTotalPrice(): number {
        return this.totalPrice
    }

    setTotalPrice(totalPrice: number): void {
         if (totalPrice >= 0) {
            this.totalPrice = totalPrice
         } else{
            throw new Error("Total price must be greater or equal to than zero." + totalPrice
            )
         }
    }

    getCustomerId(): string|undefined {
        return this.customerId;
    }

    setCustomerId(customerId?: string): void {
        this.customerId = customerId;
    }

    public getCustomer():Customer|undefined {
        return this.customer
    }
    
    public setCustomer( customer?:Customer):void {

        if (!customer) throw new Error("customer does not exist.")
        this.customer = customer
    }

    static from({

        id,
        totalPrice,
        customerId,
        customerPrisma,

    } : cartPrisma & { customerPrisma?:customerPrisma; }

) {

    return new Cart({

        id,
        totalPrice,
        customerId: customerId ? customerId : undefined,
        customer: customerPrisma ? Customer.from(customerPrisma) : undefined

    })
}
}