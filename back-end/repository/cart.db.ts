import { Cart } from "../model/cart";
import { CartInputs } from "../types";
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
const getCartByCustomerId = async (newCustomerId?: string): Promise<Cart | null> => {
    if (!newCustomerId) throw new Error("Customer ID is undefined.");

    try {
        const cartPrisma = await database.cart.findFirst({
            where: { customerId: newCustomerId },
            include: { customer: true , product : true}
        });

        if (!cartPrisma) return null;
        return Cart.from({ ...cartPrisma, customerPrisma: cartPrisma.customer || undefined });
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

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

//admin
const returnAllCartsAvailable = async (): Promise<Cart[] | null> => {
   try{
    const cartDb  = await database.cart.findMany({
        include:{
            customer:true
        }
    })
    
    return cartDb.map((cart) => Cart.from(cart))
   }catch(error){
    console.log(error)
    throw new Error("Database error. See server log for details")
   }
}

const createNewCartForCustomer = async (cart : Cart) : Promise<Cart> =>{

    try {

        const cartPrisma = await database.cart.create({
            data : {
                totalPrice : 0,
                customer : {
                    connect : {
                        id : cart.getCustomerId()
                    }
                } 
                }
            
        })

        if (!cartPrisma) throw new Error("cart was not created.")

        return Cart.from(cartPrisma)
    }
    catch (error){
        console.error(error)
        throw new Error("application error. see server logs for more information.")
    }
}

export default {
    getCartByCustomerId,
    returnAllCartsAvailable,
    getCartById,
    createNewCartForCustomer
};