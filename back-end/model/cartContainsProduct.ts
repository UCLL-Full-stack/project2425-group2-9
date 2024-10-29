import { CartContainsProductInput } from "../types";

export class CartContainsProduct{
    private cartId: number | undefined; 
    private productName: string|undefined;
    private quantity: number=0;

    constructor({cartId,productName,quantity}:CartContainsProductInput){
        this.cartId = cartId;
        this.productName = productName
        this.setQuantity(quantity)
    }

    getCartId():number|undefined{
        return this.cartId 
    }
    getProductName():string|undefined{
        return this.productName
    }
    getQuantity():number{
        if (this.quantity === undefined) {
            throw new Error("Quantity is undefined");
        }
        return this.quantity;
    }
    setQuantity(quantity:number):void{
        this.quantity = quantity
    }
}