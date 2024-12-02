
import { error } from "console"
import cartDb from "../repository/cart.db"
import customerDb from "../repository/customer.db"
import orderDb from "../repository/order.db"
import database from "../util/database"
import { Customer } from "../model/customer"
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

        const getCartFromDb = await database.cart.findUnique({
            where : {
                customerId : cart.getCustomerId()
            },
            include  : {
                customer : false, order : false , product : true
            }
        }) 

        if (!getCartFromDb)
            throw new Error("cart not found")
        if (getCartFromDb.product.length == 0) {
            throw new Error("cart is empty")
        }

        const placeOrder = await orderDb.newOrder({cartId, customerId})

        if (!placeOrder)
            return null
        return "order successful"
    }
    catch(error){
        console.error(error)
        throw new Error("application error. see server logs for details")
    }
}


export default {createAnOrder}