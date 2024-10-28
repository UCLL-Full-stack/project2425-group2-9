import { Cart } from "../model/cart";
import { Customer } from "../model/customer";
import { Product } from "../model/product";
import cartDb from "../repository/cart.db";
import cartContainsProductDb from "../repository/cartContainsProduct.db";
import customerDb from "../repository/customer.db";
import productDb from "../repository/product.db";
import { DeleteCartItemInput } from "../types";

const deleteCartItem = async (customerId: number, productName: string): Promise<string> => {
    // VALIDATE
    if (!customerId) throw new Error("Customer id is required.");
    if (!productName) throw new Error("Product name is required.");

    // GET
    // Q& So much typing is needed to suppress null.
    const customer: Customer | null = customerDb.getCustomerById(customerId);
    if (!customer) throw new Error("Customer is null.");

    const product: Product | null = productDb.getProductByName(productName);
    if (!product) throw new Error(`Product ${productName} is null.`);

    const cart: Cart | null = cartDb.getCartByCustomerId(customer.getId());
    if (!cart) throw new Error("Cart is null");

    // DELETE 
    const cartId = cart.getId();
    if (cartId === undefined) throw new Error("Cart ID is undefined.");
    cartContainsProductDb.deleteCartItemByCartIdAndProductName(cartId, product.getName());

    return "Cart item deleted successfully.";
    // return product.getName();
}

export default { deleteCartItem };