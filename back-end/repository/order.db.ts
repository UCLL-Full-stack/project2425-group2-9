
import { Order } from "../model/order"
import { OrderInput } from "../types"
import database from "../util/database"


const newOrder = async ( {cartId, customerId} :OrderInput) : Promise<string| null> => {

    if (!cartId || !customerId){
        throw new Error("order cannot be created")
    }

    try {
        const cart = await database.cart.findUnique({
            where: { id: cartId,
                isActive : true
             }
        });

        if (!cart) {
            throw new Error("Cart not found");
        }
        const newOrder = await database.order.create({
        
            data : {
                cart : {
                    connect :{
                        id : cartId
                    },
                } ,
                date : new Date(),
                customer : {
                    connect : {
                        id : customerId
                    }
                } ,
                totalPrice: cart.totalPrice
                
            },
            include : {
                cart : {
                    include : {
                        product : true
                    }
                },
                customer: true
            }
        })
    
        if (!newOrder) return null
           
        return "Order placed successfully. Thank you for shopping with us."

    }
    catch(error){
        console.error(error)
        throw new Error(`${error}`)
    }
    

}

export default{ newOrder }