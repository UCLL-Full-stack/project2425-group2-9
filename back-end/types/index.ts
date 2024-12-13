
// R: Name the interfaces with capital first letter!

import { CartContainsProduct } from "@prisma/client";

type Role = "CUSTOMER" | "ADMIN" | "GUEST"
interface ProductInput {
    id? : string;
    name: string;
    price?: number;
    unit?: string;
    stock?: number;
    description?: string;
    imagePath?: string;
}

interface UploadAuth extends Request{
   
    role : Role
    productInput : ProductInput
}
interface CartInputs {
    id?: string;
    totalPrice?: number;
    customerId?: string | undefined,
    creationDate?: Date,
}

interface CustomerInput {
    id?: number;
    password?: string;
    securityQuestion?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role? : Role
}

interface OrderInput {
    cartId? : string;
    date?: Date;
    customerId? : string
}
interface CartContainsProductInput {
    cartId: number; // Foreign key to Cart
    productName: string; // Foreign key to Product
    quantity: number;//Q& am not sure but are we suppose to have a separate interface for the relationship between cart and product???
}

interface DeleteCartItemInput {
    customerId: number;
    productName: string;
}

interface AddToCartInput {
    customerId: string;
    productName: string;
}


type AuthenticationResponse = {
    token?: string;
    username?: string;
    role? : Role;
    fullname?: string;
};

interface AuthenticatedRequest extends Request {
    auth: CustomerInput;
}

interface CartDetails {
    product : CartContainsProduct[],
    totalPrice: number
}


export {
    ProductInput,
    CartInputs,
    CustomerInput,
    OrderInput,
    CartContainsProductInput,
    DeleteCartItemInput,
    AddToCartInput,
    Role,
    AuthenticationResponse,
    AuthenticatedRequest,
    UploadAuth,
    CartDetails

}