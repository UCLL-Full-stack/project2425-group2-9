import { error } from "console";
import { Cart } from "../model/cart";
import { CartContainsProduct } from "../model/cartContainsProduct";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";
import { AddToCartInput } from "../types";
import database from "../util/database";
import { Prisma } from "@prisma/client";


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

  try {
       // const cart: Cart | null = await cartDb.getCartByCustomerId(cartId);
       if (!customerId) throw new Error("Cart ID required.");
       const cart: Cart | null = await cartDb.getCartByCustomerId(customerId);
       if (!cart) {//cart does not exist for customer, create a cart and save it in the database
            const createNewCartForCustomer = await database.cart.create({
                data : {
                    totalPrice : 0,
                    customer : {
                        connect : {
                            id : customerId
                        }
                    }
                }
            })
            if (!createNewCartForCustomer)
                throw new Error("application error")
       }
   
       const product: Product | null = await productDb.getProductByName(productName);
       if (!product) throw new Error("Product does not exist.");
       
       const getCartId = cart?.getId();
       if (!getCartId) throw new Error("Cart ID is undefined.");
       let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartByCartIdAndProductName(getCartId, product.getName());
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
                await cartContainsProductDb.increaseProductByOne(cart!.getId()!, productName)
       }
   
    //    cartItem.setQuantity(cartItem.getQuantity() + 1); // TODO: This should be a PUT?!\
       if (!cart) throw new Error("Cart not found.");
       return cart;
   
  }
  catch (error) {
    console.error
    throw new Error("application error. see server logs.")
  }
   
}
const getCartInformation = async (): Promise<Cart[] | null> => {
    if (!cartDb.returnAllCartsAvailable()) {
        throw new Error("Database is empty")
    }
    return cartDb.returnAllCartsAvailable() || null//Q& i don't know if we need this, i,just thought of implementing it
}
const returnAllProductsInCart = async (cartId: string): Promise<Product[] | null> => {
  
    try {
       
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

const getCartContainsProductByCartId = async (id: string): Promise<Array<CartContainsProduct>> => {
    return await cartContainsProductDb.returnAllItemsInCart(id) || [];
};

export default {  getCartInformation, addProductToCart, returnAllProductsInCart, getCartContainsProductByCartId }