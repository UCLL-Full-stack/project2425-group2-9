
import { error } from "console"
import cartDb from "../repository/cart.db"
import customerDb from "../repository/customer.db"
import orderDb from "../repository/order.db"
import database from "../util/database"
import { Customer } from "../model/customer"
import cartContainsProductDb from "../repository/cartContainsProduct.db"
import { Order } from "@prisma/client"
const createAnOrder = async ( customerId : string) : Promise<string | null> => {

    if ( !customerId )
        throw new Error(` customer with id ${customerId} does not exist`)

    try {

        const customer : Customer |null = await customerDb.getCustomerById(customerId)
        if (!customer)
            throw new Error("customer does not exist")
        const cart = await cartDb.getCartByCustomerId(customer.getId())
        const cartId = cart?.getId()
        if (!cart)
            throw new Error(`no carts found for customer`)

        const getCartFromDb = await cartDb.getCartByCustomerId(customerId)
        if (!getCartFromDb)
            throw new Error("cart not found")

        const placeOrder = await orderDb.newOrder({cartId, customerId})

        if (placeOrder){
            await cartContainsProductDb.deleteAllCartItems(cart.getId()!)
        }else {
            throw new Error("order was not created")
        }
        
        return "order placed successful. thank you for choosing veso"
    }
    catch(error){
        console.error(error)
        throw new Error("application error:" + error)
    }
}


export default {createAnOrder}