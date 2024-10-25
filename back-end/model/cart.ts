import { cartInputs, productInput } from "../types";
import { Products } from "./product";

export class Cart {
<<<<<<< Updated upstream
    private id!: number;
    private totalPrice!: number;
    private customerId!: number;
    // Q&A Is it not better to use setters immediately in the constructor? A: https://stackoverflow.com/questions/61690611/typescript-not-recognising-initialising-via-a-setter
=======
    private id?: undefined | number;
    private totalPrice: number = 0;
    private customerId?: number|undefined; 
    // Q& Is it not better to use setters immediately in the constructor?
>>>>>>> Stashed changes
    //I also thought of the same thing. I thing we could
    //do we need any extra logic for setId methods in the classes?

<<<<<<< Updated upstream
    constructor(cart: { id: number, totalPrice: number, customerId: number }) {
        this.setId(cart.id);
        this.setTotalPrice(cart.totalPrice);
        this.setCustomerId(cart.customerId);
=======
    constructor( { id,totalPrice,customerId}:cartInputs) {
        this.setId(id);
        this.setCustomerId(customerId);
        this.setTotalPrice(totalPrice) 
>>>>>>> Stashed changes
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getTotalPrice(): number {
<<<<<<< Updated upstream
        return this.totalPrice;
=======
        return this.totalPrice
>>>>>>> Stashed changes
    }

    setTotalPrice(totalPrice: number): void {
        this.totalPrice = totalPrice;
    }

<<<<<<< Updated upstream
    getCustomerId(): number {
        return this.customerId;
    }

    setCustomerId(customerId: number): void {
=======
    getCustomerId(): number|undefined {
        return this.customerId;
    }

    setCustomerId(customerId: number | undefined): void {
>>>>>>> Stashed changes
        this.customerId = customerId;
    }
    // getProducts():Products[]|undefined{
    //     return this.products
    // }
    // setProducts(newProducts: Products[]): void {
    //     if (!newProducts) {
    //         return;
    //     }
    //     if (!this.products) {
    //         this.products = [];
    //     }
    //     newProducts.forEach(newProduct => {
    //         const productName = this.products?.find(product => product.getName() === newProduct.getName());
    //         if (!productName) {
    //             this.products?.push(newProduct);
    //         }
    //     });
    // }
}