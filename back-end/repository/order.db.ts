
import { OrderInput } from "../types"
import database from "../util/database"

const newOrder = async ( {cartId, customerId} :OrderInput) : Promise<String | null> => {

    if (!cartId || !customerId){
        throw new Error("order cannot be created")
    }

    try {
        const newOrder = await database.order.create({
        
            data : {
                cartId : cartId,
                date : new Date(),
                customerId : customerId
            }
        })
    
        if (!newOrder)
            throw new Error("order was not created")
        return 'order created successfully. thank you for shopping with us.'
    }
    catch(error){
        console.error(error)
        throw new Error("application error. see server logs for details.")
    }
    

}

export default{ newOrder }