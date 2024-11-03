import { Cart } from "../model/cart";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";
import { DeleteCartItemInput } from "../types";

const deleteCartItem = async ({ customerId, productName }: { customerId: number, productName: string }): Promise<string> => {

    // GET
    const customer: Customer | null = customerDb.getCustomerById(customerId);
    if (!customer) throw new Error(`Customer with id ${customerId} does not exist.`);
    const cart: Cart | null = cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error(`Customer ${customer.getUsername()} does not have a cart.`);

    // CONNECT & SAVE
    cartContainsProductDb.deleteCartItemByCartIdAndProductName(cart.getId(), productName);
    return `Cart item '${productName}' deleted successfully.`;
}

const deleteAllCartItems = async (customerId: number): Promise<string> => {
    // GET
    if (!customerId) throw new Error("Customer ID required.");
    const customer: Customer | null = customerDb.getCustomerById(customerId);
    if (!customer) throw new Error("Customer does not exist.");

    const cart: Cart | null = cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart does not exist.");


    // CONNECT & SAVE
    return await cartContainsProductDb.deleteAllCartItems(cart.getId());
};

export default { deleteCartItem, deleteAllCartItems };