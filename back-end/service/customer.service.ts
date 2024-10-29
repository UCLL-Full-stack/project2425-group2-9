import { Cart } from "../model/cart";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";
import { DeleteCartItemInput } from "../types";

const deleteCartItem = ({ customerId, productName }: { customerId: number, productName: string }): string => {

    // GET
    const customer: Customer | null = customerDb.getCustomerById(customerId);
    if (!customer) throw new Error(`Customer with id ${customerId} does not exist.`);
    const cart: Cart | null = cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error(`Customer ${customer.getUsername()} does not have a cart.`);

    // DELETE 
    cartContainsProductDb.deleteCartItemByCartIdAndProductName(cart.getId(), productName);
    return `Cart item '${productName}' deleted successfully.`;
}

export default { deleteCartItem };