
import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import productDb from "../repository/product.db";
import { AddToCartInput, CartDetails } from "../types";


const addProductToCart = async ({ customerId, productName }: AddToCartInput): Promise<Cart> => {
    try {
        const product: Product | null = await productDb.getProductByName(productName);
        if (!product) throw new Error("Product does not exist.");
        if (!customerId) throw new Error("Customer ID required.");

        let cart: Cart | null = await cartDb.getCartByCustomerId(customerId);
        if (!cart || cart.getIsActive() === false ) {
            // Cart does not exist for customer, create a cart and save it in the database
            cart = new Cart({ customerId, totalPrice: product.getPrice(), isActive : true });
            const createNewCartForCustomer = await cartDb.createNewCartForCustomer(cart);
            if (!createNewCartForCustomer) throw new Error("Cart was not created");
            cart = createNewCartForCustomer;
        }

        const getCartId = cart?.getId();
        if (!getCartId) throw new Error("Cart ID is undefined.");

        let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartByCartIdAndProductName(getCartId, product.getName());

        // If cart does not contain the item, create the first one.
        if (!cartItem) {
            cartItem = new CartContainsProduct({
                cartId: getCartId,
                productName: product.getName(),
                quantity: 1
            });
            await cartContainsProductDb.addCartItem(cartItem);
        } else {
            await cartContainsProductDb.updateProduct(getCartId, productName);
        }

        // Recalculate the total price
        const newTotalPrice = await cartContainsProductDb.calculateTotalPrice({ cartId: getCartId });

        // Update the cart with the new total price
        await cartDb.updateCartTotalPrice(getCartId, newTotalPrice);

        // Fetch the updated cart
        cart = await cartDb.getCartById(getCartId);
        if (!cart) throw new Error("Cart not found.");

        return cart;
    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
};


//admin
const getAllCartsAvailable = async (): Promise<Cart[] | null> => {
    try {
        const returnAllCartsCreated = await cartDb.returnAllCartsAvailable()
    // const singleCart = await cartDb.returnAllCartsAvailable().then((carts)=> carts?.find((cart) => cart))
    if (!returnAllCartsCreated || (Array.isArray(returnAllCartsCreated) && returnAllCartsCreated.length ===0) ) {
        throw new Error("No carts found. Database is empty")
    }

    return returnAllCartsCreated //Q& i don't know if we need this, i,just thought of implementing it
}catch(error) {
throw new Error(`Application error: ${error}`)
}
}
//customer


const getCartContainsProductByCartId = async ( {cartId}: {cartId :string} ): Promise<Array<CartContainsProduct>> => {
    try {

        const cartItems = await cartContainsProductDb.returnAllItemsInCart(cartId) || [];
        if (!cartItems || (Array.isArray(cartItems) && cartItems.length === 0)) throw new Error("cart has no products")
        return cartItems
    
    }
    catch(error){
        throw new Error('cart has no products')
    }
    }

    const getCartIdByCustomerId = async (customerId : string) :Promise<string|null> => {

        const cart = await cartDb.getCartByCustomerId(customerId);
        return cart ? cart.getId() ?? null : null;
    }

    const getCartDetails = async ({ customerId }: { customerId: string }): Promise<CartDetails[]> => {
        try {
            const cartId = await getCartIdByCustomerId(customerId);
            if (!cartId) throw new Error('Cart not found for customer');
    
            const items = await getCartContainsProductByCartId({ cartId });
            if (!items || items.length === 0) {

                console.error(`No items found in cart for cartId ${cartId}`)
                return []
            }
    
            const totalPrice = await cartContainsProductDb.calculateTotalPrice({ cartId });
    
            return [{
                product: items.map(item => ({
                    cartId: item.getCartId(),
                    productName: item.getProductName(),
                    quantity: item.getQuantity(),
                    price: `$${item.getProduct()?.getPrice()}`,
                    cart: item.getCart()
                })),
                totalPrice
            }];
        } catch (error) {
            throw new Error(`${error}`);
        }
    };
    




export default {  getAllCartsAvailable, addProductToCart,  getCartContainsProductByCartId , getCartDetails, getCartIdByCustomerId, }