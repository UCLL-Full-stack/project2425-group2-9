import { CartInputs, ProductInput } from "../types";
import { Product } from "./product";

export class Cart {
    private id?: undefined | number;
    private totalPrice: number = 0;
    private customerId?: number|undefined; 

    // Q& Is it not better to use setters immediately in the constructor?
    //I also thought of the same thing. I thing we could
    //do we need any extra logic for setId methods in the classes?

    constructor( { id,totalPrice,customerId}: CartInputs) {
        this.setId(id);
        this.setCustomerId(customerId);
        this.setTotalPrice(totalPrice) 
    }

    getId(): number | undefined{
        return this.id;
    }

    setId(id: number|undefined): void {
        this.id = id;
    }

    getTotalPrice(): number {
        return this.totalPrice
    }

    setTotalPrice(totalPrice: number): void {
        this.totalPrice = totalPrice;
    }

    getCustomerId(): number|undefined {
        return this.customerId;
    }

    setCustomerId(customerId: number | undefined): void {
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