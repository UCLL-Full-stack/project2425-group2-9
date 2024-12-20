import { Order } from "../../model/order";
import { Cart } from "../../model/cart";
import { Customer } from "../../model/customer";
import orderDb from "../../repository/order.db";
import cartDb from "../../repository/cart.db";
import customerDb from "../../repository/customer.db";
import cartContainsProductDb from "../../repository/cartContainsProduct.db";
import orderService from "../../service/order.service";
import { set } from 'date-fns';

// GIVEN -----------------------------------


const date = set(new Date(), { hours: 15, minutes: 30, seconds: 20, milliseconds: 200 });
const cartId = "2e937a99-6713-4237-86b9-817b2939fbe6";
const customer = new Customer({ id: "1", username: "John Doe", firstName: "John", lastName: "Doe", password: "password123", phone: "12345678", role: "CUSTOMER" });
const cart = new Cart({ id: cartId, customerId: customer.getId(), totalPrice: 100, customer , isActive:true});
const order = new Order({ id: 1, date, cartId, customerId: customer.getId()!, totalPrice: cart.getTotalPrice(), cart, customer });


// SETUP -----------------------------------


let mockOrderDb_newOrder: jest.Mock;
let mockCartDb_getCartByCustomerId: jest.Mock;
let mockCustomerDb_getCustomerById: jest.Mock;
let mockCartContainsProductDb_deleteAllCartItems: jest.Mock;


beforeEach(() => {
    mockOrderDb_newOrder = jest.fn();
    mockCartDb_getCartByCustomerId = jest.fn();
    mockCustomerDb_getCustomerById = jest.fn();
    mockCartContainsProductDb_deleteAllCartItems = jest.fn();
});


afterEach(() => {
    jest.clearAllMocks();
});


// TESTS -----------------------------------


test("Given valid customer ID; When creating an order; Then order is created and cart items are deleted.", async () => {
    // GIVEN
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    orderDb.newOrder = mockOrderDb_newOrder.mockReturnValue(order);
    cartContainsProductDb.deleteAllCartItems = mockCartContainsProductDb_deleteAllCartItems.mockReturnValue("items deleted successfully");

    // WHEN
    const result = await orderService.createAnOrder(customer.getId()!);

    // THEN
    expect(result).toBe("order placed successful. thank you for choosing veso");
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customer.getId());
    expect(mockOrderDb_newOrder).toHaveBeenCalledWith({ cartId, customerId: customer.getId() });
    expect(mockCartContainsProductDb_deleteAllCartItems).toHaveBeenCalledWith(cart.getId());
});

test("Given invalid customer ID; When creating an order; Then error is thrown.", async () => {
    // GIVEN
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(undefined);

    // WHEN and THEN
    await expect(orderService.createAnOrder("invalid-customer-id")).rejects.toThrow("customer does not exist");
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith("invalid-customer-id");
});

test("Given valid customer ID but no cart; When creating an order; Then error is thrown.", async () => {
    // GIVEN
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(undefined);

    // WHEN and THEN
    await expect(orderService.createAnOrder(customer.getId()!)).rejects.toThrow("cart not found");
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customer.getId());
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());
});

test("Given valid customer ID and cart; When order creation fails; Then error is thrown.", async () => {
    // GIVEN
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    orderDb.newOrder = mockOrderDb_newOrder.mockReturnValue(undefined);

    // WHEN and THEN
    await expect(orderService.createAnOrder(customer.getId()!)).rejects.toThrow("order was not created");
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customer.getId());
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());
    expect(mockOrderDb_newOrder).toHaveBeenCalledWith({ cartId, customerId: customer.getId() });
});