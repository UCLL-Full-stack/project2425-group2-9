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

interface DeleteCartItemInput {
    customerId: number;
    productName: string;
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
}