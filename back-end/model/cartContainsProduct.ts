import { CartContainsProductInput } from "../types";

export class CartContainsProduct {
    private cartId: number;
    private productName: string;
    private quantity: number = 0;

    constructor(cartContainsProduct: { cartId: number, productName: string, quantity: number }) {
        this.cartId = cartContainsProduct.cartId;
        this.productName = cartContainsProduct.productName;
        this.setQuantity(cartContainsProduct.quantity);
    }

    getCartId(): number {
        return this.cartId
    }
    getProductName(): string {
        return this.productName
    }
    getQuantity(): number {
        if (this.quantity === undefined) {
            throw new Error("Quantity is undefined");
        }
        return this.quantity;
    }
    setQuantity(quantity: number): void {
        this.quantity = quantity
    }
}