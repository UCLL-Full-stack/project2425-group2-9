import { CartContainsProductInput } from "../types";

export class CartContainsProduct{
    private cartId: number | undefined; 
    private productName: string;
    private quantity: number;

    constructor({cartId,productName,quantity}:CartContainsProductInput){
        this.cartId = cartId;
        this.productName = productName
        this.quantity = quantity
    }

    getCartId():number|undefined{
        return this.cartId 
    }
    getProductName():string{
        return this.productName
    }
    getQuantity():number{
        return this.quantity
    }
    setQuantity(quantity:number):void{
        this.quantity = quantity
    }
}