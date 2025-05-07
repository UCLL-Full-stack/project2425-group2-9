import {  Role } from "@prisma/client";
import { Customer } from "../model/customer";
import database from "../util/database";
import { CustomerInput } from "../types";
import { da } from "date-fns/locale";

//for admin
const getAllCustomers = async () :  Promise <Customer[] | null> => {

    try  {

        const customerPrisma = await database.customer.findMany();
        if (!customerPrisma) throw new Error("no customers found")
        
        return customerPrisma.map((customerPrisma) => Customer.from(customerPrisma))
    }
    catch (error) {
        console.error(error)
        throw error
    }
}

const getCustomerById = async (customerId: string | undefined): Promise< Customer | null > => {

    if (!customerId) throw new Error(` customer with id ${customerId} does not exist`)

   try {

    const customerPrisma = await database.customer.findFirst({
        where : {
            id : customerId,
        },
        include : { cart : false, order :false }
    })
     
    if (!customerPrisma ) 
        return null
    return Customer.from(customerPrisma)
   }
    catch (error) {
        console.log(error)
        throw error
    }
}

const registerCustomer  = async ( newCustomer : Customer) : Promise<Customer |null > => {

try {

    const normalizedRole = newCustomer.getRole()?.toLowerCase() as keyof typeof Role | undefined;//used to tell TypeScript that a value is one of the keys of the Role enum.
    const createCustomer =  await database.customer.create( {
        data : {

            password : newCustomer?.getPassword(),
            username : newCustomer?.getUsername(),
            firstName : newCustomer?.getFirstName(),
            lastName : newCustomer?.getLastName(),
            phone : newCustomer?.getPhone(),
            role : normalizedRole ? Role[normalizedRole.toUpperCase() as keyof typeof Role] : Role.GUEST  // Convert role to uppercase, default to CUSTOMER

        }
    })
    return Customer.from(createCustomer)
}
catch (error) {
    console.error(error)
    throw error
}
}

const findCustomerByUserName = async ( {username} : {username : string}) : Promise<Customer[]|null> => {

    try {

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            throw new Error('Invalid username format.');
        }

        const customerPrisma = await database.customer.findMany({
            where : {
                username : username,
            },
        })

         if (!customerPrisma) {
             throw new Error(`customer with username ${username} does not exist.`)
         }
        return customerPrisma.map((customerPrisma) => Customer.from(customerPrisma))
    }
    catch(error){
        console.error(error)
        throw error
    }
}

const findCustomerByPhone = async (phone :string) : Promise<Customer| null> => {

    const customer = await database.customer.findFirst({
        where :{
            phone
        }
    })

    return customer ? Customer.from(customer) : null
}


export default {
    getCustomerById,
    registerCustomer,
    findCustomerByUserName,
    getAllCustomers,
    findCustomerByPhone
}