import { Cart } from "./cart";
import { isDate, isFuture, isValid } from "date-fns";
import { Order as orderPrisma } from "@prisma/client";
import { Cart as cartPrisma } from "@prisma/client";
import { Customer } from "./customer";
import { Customer as customerPrisma } from "@prisma/client";
export class Order {
    private id!:number;
    private cartId!: string;
    private date?: Date;
    private cart!:Cart
    private customer!: Customer

    constructor(order: { id:number, cartId: string, date?: Date, cart:Cart, customer: Customer }) {
        this.setCartId(order.cartId);
        this.setDate(order.date);
        this.setId(order.id)
        this.setCart(order.cart)
        this.setCustomer(order.customer)
    }

    public getId():number {
        return this.id
    }

    public setId( id:number ):void {
        this.id = id
    }
    public getCartId(): string | undefined {
        return this.cartId
    }
    setCartId(cartId: string) {
        this.cartId = cartId;
    }

    public getDate(): Date | undefined {
        return this.date
    }
    setDate(date?: Date) {
        if ( !date)
            throw new Error( "Date is required." +isDate(date) )
        else if( !isValid(date))
            throw new Error("Date is not valid.")
        else if ( isFuture(date) )
            throw new Error( "order date cannot be in the future")
        else {
            this.date = date;
        }  
           
    }

    getCart():Cart {
        return this.cart
    }

    setCart( cart:Cart) : void {
        this.cart = cart
    }

    getCustomer(): Customer {
        return this.customer
    }

    setCustomer( customer:Customer ): void {

        this.customer = customer
    }

    equals(newOrder: Order) {
        return (
            newOrder.cartId === this.cartId &&
            newOrder.date === this.date && 
            newOrder.cart === this.cart &&
            newOrder.customer === this.customer
        )
    }

    static from({

        id,
        cartId,
        date,
        cart,
        customer
        
    } : orderPrisma & { cart:cartPrisma; customer:customerPrisma} ) {

        return new Order({

            id,
            cartId,
            date,
            cart:Cart.from({ ...cart,}),
            customer:Customer.from(customer)

        })
    }
}