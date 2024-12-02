
import { Cart } from "../model/cart";
import database from "../util/database";

// const saveCart = (cart: Cart): Cart | undefined => {
//     const existingCart = carts.findIndex((c) => {
//         cart.getId() === c.getId()
//     })
//     if (existingCart !== -1) {
//         carts[existingCart] = cart
//     } else {
//         carts.push(cart)
//     }
//     return cart
// }

//Q& do i still need the saveCart method now that am using a real database??
const getCartByCustomerId = async (newCustomerId?: string | undefined): Promise<Cart|null> => {

    if (!newCustomerId) {
        throw new Error("customer is undefined");
    }
    
    try{
       const cartPrisma = await database.cart.findUnique({
        where:{
            customerId: newCustomerId
        },
        include:{
            customer:true
        }
       })
       if (!cartPrisma)
        throw new Error(` cart with customer Id ${newCustomerId} not found`)
       return Cart.from({ ...cartPrisma, customerPrisma: cartPrisma.customer || undefined })
    }catch(error){
        console.log(error)
        throw new Error("Database error. See server log for details")
    }

        
}

const getCartById = async (cartId: string): Promise<Cart | null> => {
    
     try{
        const cartPrisma = await database.cart.findFirst({
            where:{
                id:cartId
            },
            include:{
                customer:false 
            }
         })
         if (!cartPrisma)
            throw new Error(`cart with id ${cartId} not found.`)
        return Cart.from(cartPrisma)
     }catch(error){
        console.log(error)
        throw new Error("Database error. See server log for details")
     }
};

const returnAllCartsAvailable = async (): Promise<Cart[] | null> => {
   try{
    const cartDb  = await database.cart.findMany({
        include:{
            customer:false
        }
    })
    
    return cartDb.map((cart) => Cart.from(cart))
   }catch(error){
    console.log(error)
    throw new Error("Database error. See server log for details")
   }
}


export default {
    getCartByCustomerId,
    returnAllCartsAvailable,
    getCartById
};