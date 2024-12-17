import { Cart } from "../model/cart";
import { Customer } from "../model/customer";
import bcrypt from 'bcrypt';
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import { AuthenticationResponse, CustomerInput, ProductInput, UploadAuth, } from "../types";
import {generateJwtToken} from "../util/jwt"
import { Role } from "@prisma/client";
import { UnauthorizedError } from "express-jwt";
import productDb from "../repository/product.db";
import { Product } from "../model/product";


const deleteCartItem = async ({ customerId, productName }: { customerId: string, productName: string }): Promise<string> => {

    // GET
    const customer: Customer | null = await customerDb.getCustomerById(customerId);
    if (!customer) throw new Error(`Customer with id ${customerId} does not exist.`);
    const cart: Cart | null = await cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error(`Customer ${customer.getUsername()} does not have a cart.`);

    // CONNECT & SAVE
    cartContainsProductDb.deleteCartItemByCartIdAndProductName(cart.getId(), productName);
    return `Cart item '${productName}' deleted successfully.`;
}

const deleteAllCartItems = async (customerId: string): Promise<string> => {
    // GET
    if (!customerId) throw new Error("Customer ID required.");
    const customer: Customer | null = await customerDb.getCustomerById(customerId);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = await cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");


    // CONNECT & SAVE
    const cartId = cart.getId()
    if (!cartId)
        throw new Error("cart not found")
    return await cartContainsProductDb.deleteAllCartItems(cartId);
};


const registerCustomer = async ({password, firstName, lastName, username, phone, role } : CustomerInput) : Promise<Customer> =>{

    try {
        if (!password || !firstName || !lastName || !username || !phone || !role )
            throw new Error(" customer input is required")
        const existingCustomer =  await  customerDb.findCustomerByUserName({ username })

        const singleCustomer = existingCustomer?.find((customer) => customer)

        if (singleCustomer) {
            throw new Error (` customer with username ${username} already exist.`)
        }
    
        const hashedPassword = await bcrypt.hash(password, 12)
        const newCustomer = new Customer({password : hashedPassword,  username, firstName ,lastName, phone , role})

        await customerDb.registerCustomer(newCustomer);
        return newCustomer
}
catch(error) {
    console.error(error)
    throw new Error("application error. see server log for more info.")
}
}


const authenticate = async ({ username, password }: CustomerInput): Promise<AuthenticationResponse> => {

    try {
        if (!username || !password ) throw new Error("password and username is required")
            const customer = await customerDb.findCustomerByUserName({ username });
        if (! customer || customer.length === 0 ) throw new Error("you are not registered in our system. please signup.")

        const singleCustomer = customer?.find((customer) => customer)
             
        if (!singleCustomer?.getPassword()) {
            throw new Error("Password is not set for this user.");
          }
            const isValidPassword = await bcrypt.compare(password, singleCustomer?.getPassword());
            
            if (!isValidPassword) {
                throw new Error('Incorrect password. please try again');
            }
             if ( singleCustomer?.getUsername() !== username) throw new Error("Incorrect username. please try again")
    
            return {
                // message : "Authentication successful.",
                token: generateJwtToken({ username, role : singleCustomer?.getRole() as Role }),
                username: username,
                role : singleCustomer?.getRole(),
                fullname: `${singleCustomer?.getFirstName()} ${singleCustomer?.getLastName()}`,
            };
            
    }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Authentication error: ${error.message}`);
            } else {
                throw new Error('Authentication error: unknown error');
            }
          
    }
};


const getAllCustomers = async ( {username, role} : CustomerInput): Promise<Customer[]> => {

    if (!username) throw new Error("Username is required for customer role.");
    try {
        if ( role === "ADMIN") {
            const allCustomers = await customerDb.getAllCustomers();
            if (!allCustomers) throw new Error( "no customers found")
            return allCustomers
        }
           
        else if ( role === "CUSTOMER"){
            const singleCustomer = await customerDb.findCustomerByUserName( { username } )
            if (!singleCustomer) throw new Error (` customer with username ${username} does not exist`)
            return singleCustomer
        }

        else {
            throw new UnauthorizedError('credentials_required', {
                message : 'you are not authorized to access the resource'
            })
        }
            
    }
    catch(error) {
        console.error(error) 
        throw new UnauthorizedError('credentials_required', {
                message : 'you are not authorized to access the resource'
            })
    }

}

//admin
const uploadNewProduct = async ( { name ,price, unit ,stock , description ,imagePath} : ProductInput) : Promise<Product | null> => {

    try {
         if (

            !name || 
            !unit || 
            !price ||
            !stock || 
            !description || 
            !imagePath
        
        )
             
            throw new Error("all fields required")

         const newProduct =  new Product({
             
             name ,
             price ,
             unit ,
             stock ,
             description,
             imagePath 
 
         })
 
        //  if (role !== "ADMIN")
        //     throw new UnauthorizedError('credentials_required', {
        //         message : 'you are not authorized to access the resource'
        //     })
         return await productDb.addNewProduct(newProduct)
     
    }
    catch(error){
        console.error(error)
        throw new UnauthorizedError('credentials_required', {
            message : 'you are not authorized to access the resource'
        })
    }
 }

export default { deleteCartItem, deleteAllCartItems, registerCustomer, getAllCustomers, authenticate, uploadNewProduct };