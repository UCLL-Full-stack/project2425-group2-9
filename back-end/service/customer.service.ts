import { Cart } from "../model/cart";
import { Customer } from "../model/customer";
import bcrypt from 'bcrypt';
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import { CustomerInput, DeleteCartItemInput } from "../types";
import { error } from "console";

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


const registerCustomer = async ({password, firstName, lastName, username, phone, securityQuestion} : CustomerInput) : Promise<Customer> =>{

    try {
        if (!password || !firstName || !lastName || !username || !phone || !securityQuestion)
            throw new Error(" customer input is required")
        const existingCustomer =  await  customerDb.findCustomerByUserName({ username })

        if (existingCustomer) {
            throw new Error (` customer with username ${username} already exist.`)
        }
    
        const hashedPassword = await bcrypt.hash(password, 12)
        const newCustomer = new Customer({password : hashedPassword, securityQuestion, username, firstName ,lastName, phone })

        await customerDb.registerCustomer(newCustomer)
        return newCustomer
}
catch(error) {
    console.error(error)
    throw new Error("application error. see server log for more info.")
}
}
export default { deleteCartItem, deleteAllCartItems, registerCustomer };