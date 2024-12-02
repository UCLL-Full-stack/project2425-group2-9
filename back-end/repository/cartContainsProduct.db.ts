
import { Prisma } from "@prisma/client";
import { CartContainsProduct } from "../model/cartContainsProduct";
import database from "../util/database";
import { error } from "console";


const getCartItemNamesByCartId = async (id: string): Promise<string[] | undefined> => {
    try{
        const cartContainsProductPrisma = await database.cartContainsProduct.findMany({

            where:{
                cartId : id
            },
            include:{cart:false, product:true}

        })
        if ( !cartContainsProductPrisma || cartContainsProductPrisma.length  == 0)
            throw new Error("no products/carts found")

        const  cartContainsProductOb =  cartContainsProductPrisma.map(

            (cartContainsProductPrisma) => CartContainsProduct.from({
                ...cartContainsProductPrisma,
                product: cartContainsProductPrisma.product ? cartContainsProductPrisma.product : undefined
            })

            ) 
    
        const productNames = cartContainsProductOb.map(
            cartContainsProductOb => cartContainsProductOb.getProduct()?.getName())

        return productNames.filter((name): name is string => name !== undefined)
        
    }catch(error){
        throw new Error("Database error. See server log for details.")
    }
};

const getCartByCartIdAndProductName = async (cartId: string, productName: string): Promise<CartContainsProduct | null> => {

    try{
        const cartContainsProductPrisma = await database.cartContainsProduct.findFirst( {
            where:{
                cartId : cartId, productName : productName
            },
            include : {
                cart : true, product : false
            }
        })

        if (!cartContainsProductPrisma)
            throw new Error(" no carts or products found.")

        return CartContainsProduct.from({
            ...cartContainsProductPrisma,
            cart: cartContainsProductPrisma.cart ? cartContainsProductPrisma.cart : undefined//handle situation where cart could be null
        })

    }catch(error) {
        throw new Error("Database error. See server log for details.")
    }
   
}

// Cart item is product in the cart.
const addCartItem = async (cartItem: CartContainsProduct) => {
    try{
        return await database.cartContainsProduct.create({
            data : {

                cartId : cartItem.getCartId(),
                productName : cartItem.getProductName(),
                quantity : cartItem.getQuantity(),
               
            }
        })
    }catch(error){
        console.log(error)
    }
};


// const getCartItemByCartId, returns a list of all items with the correct cart id.
const returnAllItemsInCart = async (uniqueCartId: string | undefined):Promise< CartContainsProduct[] | undefined> => {

    try {

        const cartContainsProductPrisma = await database.cartContainsProduct.findMany({

            where : {
                cartId : uniqueCartId
            },
            include: { cart: false, product : true }
        })

        if ( !cartContainsProductPrisma || cartContainsProductPrisma.length == 0 )
            throw new Error("no carts found")

        return cartContainsProductPrisma.map(

            (cartContainsProductPrisma) => CartContainsProduct.from(
                {...cartContainsProductPrisma, product: cartContainsProductPrisma.product? cartContainsProductPrisma.product : undefined }
            )
        )
    } catch(error) {
        console.log(error)
    }
   
}//now we have a list of carts that match a particular cart id

const deleteCartItemByCartIdAndProductName = async (cartId: string | undefined, name: string):  Promise<string | null> => {

    if ( !cartId ) 
        throw new Error("cartId is undefined");
    
    if (!name)
        throw new Error("name is undefined")

   try {

    const cartContainsProductPrisma = await database.cartContainsProduct.delete({

    //always use the compound unique key carId_productName to delete an item from cart
        where : {
            cartId_productName: {
                cartId: cartId,
                productName: name
                
            }
        }
    })
    if ( !cartContainsProductPrisma ) 
         return "items were not deleted"
    return "items deleted successfully"
   
   }
   catch(error){
    console.error(error)
    throw new Error("Database error. See server log for details.")
   }
};

const deleteAllCartItems = async (cartId: string): Promise<string>=> {

    try {

        const cartContainsProductPrisma  = await database.cartContainsProduct.deleteMany({

            where: {
                cartId : cartId
            }
        })
         
        if (cartContainsProductPrisma.count == 0)
            throw new Error( "no items to be deleted" )
        return "items deleted successfully"
    }
    catch (error) {
        throw new Error("Database error. See server log for details.")
    }

};

const getProductsByNameInCart = async (cartId: string | undefined, productName: string): Promise<CartContainsProduct[] | undefined> => {
    
    if (!cartId)
        throw new Error(`cart with id ${cartId} not found`)

   try {

    const returnAllItemsInCartResult = returnAllItemsInCart(cartId)

    if (!returnAllItemsInCartResult) 
        throw new Error( "undefined" )

    return returnAllItemsInCartResult.then(
        (result) => result?.filter(
            (cartContainsProduct) => cartContainsProduct.getProductName() == productName))

   } catch(error) {
    console.log(error)
   }
};

const increaseProductByOne = async (cartId: string, name: string) => {
    try {
        if (!cartId || !name)
            throw new Error("undefined cart");

        const increaseProductQuantity = await database.cartContainsProduct.update({
            data: {
                quantity: {
                    increment: 1
                }
            },
            where: {
                cartId_productName: {
                    cartId: cartId,
                    productName: name
                },
            },
            include : {
                cart : true , product : true
            }
        });

        if (!increaseProductQuantity)
            throw new Error(" product quantity was not increased.")
    } 
    catch (error) {
        console.log(error);
    }
};

export default {
    getCartItemNamesByCartId,
    deleteCartItemByCartIdAndProductName,
    getCartByCartIdAndProductName,
    // addOrUpdateProduct,
    getProductsByNameInCart,
    returnAllItemsInCart,
    addCartItem,
    deleteAllCartItems,
    increaseProductByOne
}
