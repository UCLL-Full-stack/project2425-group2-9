import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";
import { AddToCartInput } from "../types";



//Q& should all methods in the service be asynchronous?
const createNewCart = async (newCustomerId: number): Promise<Cart | null> => {
    const customer = await customerDb.getCustomerById(newCustomerId);
    if (!customer) throw new Error(`No customer found with id ${newCustomerId}`);
    const hasCart = cartDb.getCartByCustomerId(customer.getId());
    if (hasCart) throw new Error(`Customer has a cart.`);
    // True && False => False
    if (customer && !hasCart) {// Q& customer does not have a cart
        customer.setId(newCustomerId);//Q& i don't know why the endpoint does not work without this line - customer already exist with an ID so setter should not be called.
        const newCart = new Cart({
            id: (cartDb.returnAllCartsAvailable()?.length ?? 0) + 1,//returnAllCartsAvailable is used only if cart does exist for a customer 
            totalPrice: 0,
            customerId: customer.getId(),
        });
        await cartDb.saveCart(newCart);
        return newCart;
    }
    return null;
}

const addProductToCart = async ({ cartId, productName }: AddToCartInput): Promise<Cart> => {
    // // VALIDATE
    // if ((!customerInput)) throw new Error("Customer required.");
    // if (!productInput) throw new Error("Product required.");

    // GET
    // if (!cartId) throw new Error("Customer ID required.");
    // const customer: Customer | null = await customerDb.getCustomerById(cartId);
    // if (!customer) throw new Error("Customer does not exist.");


    // const cart: Cart | null = await cartDb.getCartByCustomerId(cartId);
    if (!cartId) throw new Error("Cart ID required.");
    const cart: Cart | null = await cartDb.getCartById(cartId);
    if (!cart) throw new Error("Cart does not exist.");


    const product: Product | null = await productDb.getProductByName(productName);
    if (!product) throw new Error("Product does not exist.");

    let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartByCartIdAndProductName(cart.getId(), product.getName());
    // if (!cartItem) throw new Error("Cart does not contains the product.");

    // CONNECT & SAVE
    // If cart does not contain the item, create the first one.
    if (!cartItem) {
        cartItem = new CartContainsProduct({
            cartId: cart.getId(),
            productName: product.getName(),
            quantity: 0
        });
        cartContainsProductDb.addCartItem(cartItem); // TODO: This should the only function of a POST request! Updating should be PUT!
    };

    cartItem.setQuantity(cartItem.getQuantity() + 1); // TODO: This should be a PUT?!\



    return cart;

    // if (!cart) throw new Error("Cart does not exists for the customer.");
    // // if (cart) {
    // const cartId = cart.getId();
    // if (cartId === undefined) {
    //     throw new Error("Cart ID is undefined");
    // }

    // TODO: Check if the user exists!

    // if (!product) {
    //     throw new Error("product does not exist")
    // }
    // const cartItem = await cartContainsProductDb.getCartByCartIdAndProductName(cartId, product.getName())
    // if (!cartItem) throw new Error("no cart found")
    // // if (cartItem) {
    // cartItem.setQuantity(cartItem.getQuantity() + 1)
    // } else {
    //     const newCartItem = new CartContainsProduct({ cartId, productName: existingProduct.getName(), quantity: 1 });
    //     cartContainsProductDb.addOrUpdateProduct(newCartItem);
    // }
    // return cart
    // } else {
    //     // //no cart, then create new cart
    //     // const fetchProduct = await productDb.getOrSaveProductByName(product.name, product)
    //     // if (!fetchProduct) throw new Error("product repo returned null")
    //     // const newProduct = productDb.saveNewProduct(fetchProduct)
    //     // if (!newProduct) throw new Error("product was not added")
    //     // const newCart = await createNewCart(customer.getId())
    //     // if (!newCart) throw new Error("no customer found")
    //     // const newCartItem = new CartContainsProduct({ cartId: newCart.getId(), productName: newProduct.getName(), quantity: 0 });


    //     // await cartContainsProductDb.addOrUpdateProduct(newCartItem);
    //     // return newCart
    // }

}
const getCartInformation = async (): Promise<Cart[] | null> => {
    if (!cartDb.returnAllCartsAvailable()) {
        throw new Error("Database is empty")
    }
    return cartDb.returnAllCartsAvailable() || null//Q& i don't know if we need this, i,just thought of implementing it
}
const returnAllProductsInCart = async (cartId: number): Promise<Product[] | null> => {
    // cartDb.getCartById(cartId);

    try {
        // const cart = await cartDb.getCartByCustomerId(customerId)
        // if (!cart)
        //     throw new Error("cart does not exist")

        // const cartId = cart.getId()

        if (!cartId)
            throw new Error("no card with id:" + `${cartId}`)

        const [fetchCartItemNamesByCartId] = await Promise.all([cartContainsProductDb.getCartItemNamesByCartId(cartId)])//Q& am not so sure if we should use promise.all for now since it just returns one promise
        if (!fetchCartItemNamesByCartId)
            throw new Error("your cart is empty, please add products to it")

        const products: Product[] = await Promise.all(fetchCartItemNamesByCartId.map(async (productName: string) => {
            const product = await productDb.getProductByName(productName);
            if (!product) throw new Error(`Product with name ${productName} not found`);
            return product;
        }));

        return products;

    } catch (e) {
        console.log(e)
    }
    return null

}

const getCartContainsProductByCartId = async (id: number): Promise<Array<CartContainsProduct>> => {
    return cartContainsProductDb.returnAllItemsInCart(id);
};




export default { createNewCart, getCartInformation, addProductToCart, returnAllProductsInCart, getCartContainsProductByCartId }