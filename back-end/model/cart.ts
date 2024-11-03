import { CartInputs, ProductInput } from "../types";
import { Product } from "./product";

export class Cart {
    private id!: number;
    private totalPrice: number = 0;
    private customerId!: number;

    // Q& Is it not better to use setters immediately in the constructor?
    //I also thought of the same thing. I thing we could
    //do we need any extra logic for setId methods in the classes?

    constructor(cart: { id: number, totalPrice: number, customerId: number }) {
        this.setId(cart.id);
        this.setCustomerId(cart.customerId);
        if (cart.totalPrice !== undefined) {
            this.setTotalPrice(cart.totalPrice);
        }
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getTotalPrice(): number {
        return this.totalPrice
    }

    setTotalPrice(totalPrice: number): void {
        this.totalPrice = totalPrice;
    }

    getCustomerId(): number {
        return this.customerId;
    }

    setCustomerId(customerId: number): void {
        this.customerId = customerId;
    }
    //  getProducts():Product[]|undefined{
    //     return this.products
    // }
    //  setProducts(newProducts: Product[]): void {
    //      if (!newProducts) {
    //          return;
    //     }
    //     if (!this.products) {
    //         this.products = [];
    //     }
    //      newProducts.forEach(newProduct => {
    //         const productName = this.products?.find(product => product.getName() === newProduct.getName());
    //        if (!productName) {
    //             this.products?.push(newProduct);
    //          }
    //     });
    // }
}