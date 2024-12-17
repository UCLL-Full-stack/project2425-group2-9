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
import database from "../util/database";
import { Prisma } from "@prisma/client";
import { ToTuple } from "@prisma/client/runtime/library";


// const createNewCart = async (newCustomerId: string): Promise<string | null> => {
    
//     try {

//         const customer: Customer | null = await customerDb.getCustomerById(newCustomerId);
//     if (!customer) {
//         throw new Error("Customer does not exist.");
//     }
//     const hasCart = await cartDb.getCartByCustomerId(customer.getId());
//     if ( hasCart ) throw new Error(`Customer has a cart.`);
//     // True && False => False
//     if (customer && !hasCart) {// Q& customer does not have a cart
//         ;//Q& i don't know why the endpoint does not work without this line - customer already exist with an ID so setter should not be called.
//         const newCart = await database.cart.create({
//             data : {
//                 totalPrice : 0,
//                 customerId : newCustomerId
//             }
//         })
//         // await cartDb.saveCart(newCart);
//         // if (!newCart)
//         //     throw new Error("cart was not created")
//     }
//     return "cart created successfully"
//     }
//     catch (error) {
//         console.error(error)
//         throw new Error("Database error. See server log for details.")
//     }
// }



const addProductToCart = async ({ customerId, productName }: AddToCartInput): Promise<Cart> => {

    if (!customerId || !productName) throw new Error("Customer ID and productName is required.");
  try {
       // const cart: Cart | null = await cartDb.getCartByCustomerId(cartId);

       const product: Product | null = await productDb.getProductByName(productName);
        if (!product) throw new Error("Product does not exist.");
        
       if (!customerId) throw new Error("Cart ID required.");
       const cart: Cart | null = await cartDb.getCartByCustomerId(customerId);
       if (!cart) {//cart does not exist for customer, create a cart and save it in the database


        const customer: Customer | null = await customerDb.getCustomerById(customerId);
        if (!customer) throw new Error("Customer does not exist.");

        const newCart = new Cart({ customerId, totalPrice: product.getPrice(), customer });
            const createNewCartForCustomer = await cartDb.createNewCartForCustomer(newCart)
                
            if (!createNewCartForCustomer)
                throw new Error("Cart was not created.")
       }
   
    //    const getCartId = cart?.getId();
    //    if (!getCartId) throw new Error("Cart ID is undefined.");
       let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartByCartIdAndProductName(cart?.getId()!, product.getName());
       // if (!cartItem) throw new Error("Cart does not contains the product.");
   
       // CONNECT & SAVE
       // If cart does not contain the item, create the first one.
       if (!cartItem) {
           cartItem = new CartContainsProduct({
               cartId: cart?.getId()!,
               productName: product.getName(),
               quantity: 1
           });
           cartContainsProductDb.addCartItem(cartItem); // TODO: This should the only function of a POST request! Updating should be PUT!
       }
       else {
                await cartContainsProductDb.updateProduct(cart!.getId()!, productName)
       }
   
    //    cartItem.setQuantity(cartItem.getQuantity() + 1); // TODO: This should be a PUT?!\
       if (!cart) throw new Error("Cart not found.");
       return cart;
   
  }
  catch (error) {
    console.error
    throw new Error("Application error:" + error)
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
    throw new
  Error('cart has no products')
}
}
export default {  getAllCartsAvailable, addProductToCart,  getCartContainsProductByCartId , getCartDetails}