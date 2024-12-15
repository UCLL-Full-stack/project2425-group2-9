import { error } from "console";
import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";
import { AddToCartInput, CartDetails, CartInputs } from "../types";



const addProductToCart = async ({ customerId, productName }: AddToCartInput): Promise<Cart> => {

    if (!customerId || !productName) throw new Error("Customer ID and productName is required.");
    try {

        const product: Product | null = await productDb.getProductByName(productName);
        if (!product) throw new Error("Product does not exist.");

        let cart: Cart | null = await cartDb.getCartByCustomerId(customerId);
         //would it be better to first check if customer exist and use the existing customers id to get the cart of the customer?
        if (!cart) {

            const customer: Customer | null = await customerDb.getCustomerById(customerId);
            if (!customer) throw new Error("Customer does not exist.");

            //create new cart for the customer with the given customer Id
            const newCart = new Cart({ customerId, totalPrice: product.getPrice(), customer });
            cart = await cartDb.createNewCartForCustomer(newCart);
            if (!cart) throw new Error("Cart was not created.");

        }

        let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartByCartIdAndProductName(cart.getId()!, product.getName());
        if (!cartItem) {

            cartItem = new CartContainsProduct({
                cartId: cart.getId()!,
                productName: product.getName(),
                quantity: 1

            });
            await cartContainsProductDb.addCartItem(cartItem);
        } else {
            await cartContainsProductDb.updateProduct(cart.getId()!, productName);
        }

        return cart;
    } catch (error) {

        console.error(error);
       
        throw new Error("Application error:" + error);
    }
}

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

const getCartContainsProductByCartId = async ( {cartId}: {cartId :string }): Promise<Array<CartContainsProduct>> => {
    
    try {

        const cartItems = await cartContainsProductDb.returnAllItemsInCart(cartId) || [];

        if (!cartItems || (Array.isArray(cartItems) && cartItems.length === 0)) throw new Error("cart has no products")
        return cartItems
    }
    catch(error){
        throw new Error('cart has no products')
    }
};



 const getCartDetails = async ({cartId} : {cartId : string}) : Promise<CartDetails[]> =>{
    
     try {

        const items = await getCartContainsProductByCartId({cartId})
        if (!items || items.length === 0) throw new Error("cart has no products")
     const totalPrice = await cartContainsProductDb.calculateTotalPrice({cartId})

    
     return [{ product: items.map(item => 

        ({ cartId: item.getCartId(), 
        productName: item.getProductName(), 
        quantity: item.getQuantity(),
        price : `$${item.getProduct()?.getPrice()}`

    })), 

        totalPrice }]
     }
     catch(error){
        throw new Error('cart has no products')
     }
 }
export default {  getAllCartsAvailable, addProductToCart, getCartDetails, getCartContainsProductByCartId , }