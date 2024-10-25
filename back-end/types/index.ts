<<<<<<< Updated upstream
// R: Name the interfaces with capital first letter!

interface ProductInput {
    name?: string;
    price?: number;
    unit?: string;
    stock?: number;
    description?: string;
    imagePath?: string;
}

interface CartInput {
    Id?: number | undefined;
    totalPrice: number;
=======
import { Products } from "../model/product";

interface productInput{
    name:string;
    price:number;
    unit:string;
    stock:number;
    description:string;
    imagePath:string;
}

interface cartInputs{
    id?:number | undefined;
    totalPrice:number;
    customerId?:number | undefined
    creationDate?:Date
>>>>>>> Stashed changes
}

interface CustomerInput {
    id?: undefined | number;
    password?: string;
    securityQuestion?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: number;
}

interface OrderInput {
    cartId: number;
    date: Date;
}
interface cartContainsProduct{
    cartId: number; // Foreign key to Cart
    productId: number; // Foreign key to Product
    quantity: number;//Q& am sure but are we suppose to have a separate interface for the relationship between cart and product???
}

<<<<<<< Updated upstream
interface DeleteCartItemInput {
    customer: CustomerInput;
    product: ProductInput;
}

interface CartContainsProduct {
    cartId: number,
    productName: string
}

export {
    ProductInput,
    CartInput,
    CustomerInput,
    OrderInput,
    DeleteCartItemInput,
    CartContainsProduct
=======
export{
    productInput,
    cartInputs,
    customerInput,
    orderInput,
    cartContainsProduct
>>>>>>> Stashed changes
}