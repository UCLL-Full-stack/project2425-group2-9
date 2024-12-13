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
    try {
        if (!customerId) throw new Error("Customer ID required.");

        let cart: Cart | null = await cartDb.getCartByCustomerId(customerId);
        if (!cart) {
            const customer: Customer | null = await customerDb.getCustomerById(customerId);
            if (!customer) throw new Error("Customer does not exist.");

            //create new cart for the customer with the given customer Id
            const newCart = new Cart({ customerId, totalPrice: 0, customer });
            cart = await cartDb.createNewCartForCustomer(newCart);
            if (!cart) throw new Error("Cart was not created.");
        }

        const product: Product | null = await productDb.getProductByName(productName);
        if (!product) throw new Error("Product does not exist.");

        let cartItem: CartContainsProduct | null = await cartContainsProductDb.getCartByCartIdAndProductName(cart.getId()!, product.getName());
        if (!cartItem) {
            cartItem = new CartContainsProduct({
                cartId: cart.getId()!,
                productName: product.getName(),
                quantity: 1
            });
            await cartContainsProductDb.addCartItem(cartItem);
        } else {
            await cartContainsProductDb.increaseProductByOne(cart.getId()!, productName);
        }

        return cart;
    } catch (error) {
        console.error(error);
        throw new Error("Application error. See server logs.");
    }
}

const getCartInformation = async (): Promise<Cart | null> => {

    const singleCart = await cartDb.returnAllCartsAvailable().then((carts)=> carts?.find((cart) => cart))
    if (!singleCart) {
        throw new Error("Database is empty")
    }
    return singleCart //Q& i don't know if we need this, i,just thought of implementing it
}
//customer



const getCartContainsProductByCartId = async ( {cartId}: {cartId :string }): Promise<Array<CartContainsProduct>> => {
    return await cartContainsProductDb.returnAllItemsInCart(cartId) || [];
};


const calculateTotalPrice = async ( {cartId} : {cartId :string}) : Promise<number> => {
    if (!cartId) throw new Error("Cart ID is required.");

    try {
        const cartContainsProduct = await getCartContainsProductByCartId( {cartId} )

        // Log the cart items to ensure they are being fetched correctly
        console.log("Cart items for total price calculation:", cartContainsProduct);

        const totalPrice =  cartContainsProduct.reduce((finalPrice, product) => {
            const productPrice = product.getProduct()?.getPrice();
            if (!productPrice) throw new Error(`Price not found for product ${product.getProductName()}`);
            return finalPrice + (product.getQuantity() * productPrice);
        },0)

        return totalPrice
    }
    catch(error) {
        console.error("Error in calculateTotalPrice:", error);
        throw new Error('Error calculating total price');
    }
}

 const getCartDetails = async ({cartId} : {cartId : string}) : Promise<CartDetails[]> =>{
    
     const items = await getCartContainsProductByCartId({cartId})
     const totalPrice = await calculateTotalPrice({cartId})

    
     return [{ product: items.map(item => 

        ({ cartId: item.getCartId(), 
        productName: item.getProductName(), 
        quantity: item.getQuantity(),
        price : `$${item.getProduct()?.getPrice()}`

    })), 

        totalPrice }]
 }
export default {  getCartInformation, addProductToCart, getCartDetails, getCartContainsProductByCartId , }