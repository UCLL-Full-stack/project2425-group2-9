import cartDb from "../repository/cart.db";
import customerDb from "../repository/customer.db";
import orderDb from "../repository/order.db";
import { Customer } from "../model/customer";
import { Order } from "../model/order";
import { Cart } from "../model/cart";

const createAnOrder = async (customerId: string): Promise<{ order: Order, message: string } | null> => {
    if (!customerId) {
        throw new Error("Customer ID is required");
    }

    try {
        const customer: Customer | null = await customerDb.getCustomerById(customerId);
        if (!customer) {
            throw new Error("Customer does not exist");
        }

        const cart = await cartDb.getCartByCustomerId(customer.getId());
        if (!cart) {
            throw new Error("No carts found for customer");
        }

        if (cart.getIsActive() === false) {
            throw new Error("Order cannot be placed to inactive cart");
        }

        const placeOrder: { order: Order, message: string } | null = await orderDb.newOrder({ cartId: cart.getId(), customerId });

        if (!placeOrder) {
            throw new Error('Failed to place an order. Please check and try again.');
        }

        // Update the cart to set isActive to false
        cart.setIsActive(false);
        await cartDb.updateCartStatus(cart.getId()!, false);

        // Create a new cart for the customer
        const newCustomerCart = new Cart({ customerId: customer.getId(), totalPrice: 0, isActive: true });
        const newCart = await cartDb.createNewCartForCustomer(newCustomerCart);
        if (!newCart) {
            throw new Error("Failed to assign a new cart for customer");
        }

        return {
            order: placeOrder.order,
            message: "Order placed successfully. Thank you for shopping with us."
        };
    } catch (error) {
        console.error(error);
        throw new Error("Application error: " + error);
    }
};

export default { createAnOrder };