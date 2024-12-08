import { Prisma } from "@prisma/client";
import { Customer } from "../model/customer";
import database from "../util/database";
import { da } from "date-fns/locale";



const getCustomerById = async (customerId: string | undefined): Promise< Customer | null > => {

    if (!customerId) throw new Error(` customer with id ${customerId} does not exist`)

   try {

    const customerPrisma = await database.customer.findFirst({
        where : {
            id : customerId
        },
        include : { cart : false, order :false }
    })
     
    if (!customerPrisma ) 
        return null
    return Customer.from(customerPrisma)
   }
    catch (error) {
        console.log(error)
        throw new Error("Database error. See server log for details.")
    }
}


const registerCustomer  = async ( newCustomer : Customer) : Promise<Customer |null > => {

   
try {

    const createCustomer =  await database.customer.create( {
        data : {

            password : newCustomer?.getPassword(),
            securityQuestion : newCustomer?.getSecurityQuestion(),
            username : newCustomer?.getUsername(),
            firstName : newCustomer?.getFirstName(),
            lastName : newCustomer?.getLastName(),
            phone : newCustomer?.getPhone()

        }
    })
    return Customer.from(createCustomer)
}
catch (error) {
    console.error(error)
    throw new Error("application error. see server logs for more info.")
}
}

const findCustomerByUserName = async ( {username} : {username : string}) : Promise<Customer|null> => {

    try {

        const customerPrisma = await database.customer.findFirst({
            where : {
                username
            }
        })

        // if (!customerPrisma) {
        //     throw new Error(`customer with username ${username} does not exist.`)
        // }
        return customerPrisma ? Customer.from(customerPrisma) : null
    }
    catch(error){
        console.error(error)
        throw new Error ("application error. see server log for more info.")
    }
}


export default {
    getCustomerById,
    registerCustomer,
    findCustomerByUserName
}