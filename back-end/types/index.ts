
// R: Name the interfaces with capital first letter!


interface ProductInput {
    name?: string;
    price?: number;
    unit?: string;
    stock?: number;
    description?: string;
    imagePath?: string;
}

interface CartInputs{
    id?:number | undefined;
    totalPrice:number;
    customerId?:number | undefined,
    creationDate?:Date,
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
interface CartContainsProductInput{
    cartId: number|undefined; // Foreign key to Cart
    productName: string; // Foreign key to Product
    quantity: number;//Q& am not sure but are we suppose to have a separate interface for the relationship between cart and product???
}

interface DeleteCartItemInput {
    customer: CustomerInput;
    product: ProductInput;
}

export{
    ProductInput,
    CartInputs,
    CustomerInput,
    OrderInput,
    CartContainsProductInput,
    DeleteCartItemInput
}