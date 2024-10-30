import { Cart } from "../../model/cart";
import { Customer } from "../../model/customer";
import cartDb from "../../repository/cart.db";
import cartContainsProductDb from "../../repository/cartContainsProduct.db";
import customerDb from "../../repository/customer.db";
import customerService from "../../service/customer.service";


const customer: Customer = new Customer({
    id: 1,
    password: "m@t3j-v3s3l",
    securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
    username: "Matej333",
    firstName: "Matej",
    lastName: "Vesel",
    phone: 333444555666
})

const customerWithoutCart: Customer = new Customer({
    id: 2,
    password: "r0l@nd/nd1m3/s0n3",
    securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
    username: "Roland333",
    firstName: "Roland",
    lastName: "Ndime Sone",
    phone: 444555666777
})

const cart: Cart = new Cart({
    id: 1,
    totalPrice: 30,
    customerId: 1,
})


let mockDeleteCartItem: jest.Mock;

let mockCustomerDbGetCustomerById: jest.Mock;
let mockCartDbGetCartByCustomerId: jest.Mock;
let mockCartContainsProductDbDeleteCartItemByCartIdAndProductName: jest.Mock;

beforeEach(() => {
    mockDeleteCartItem = jest.fn();

    mockCustomerDbGetCustomerById = jest.fn();
    mockCartDbGetCartByCustomerId = jest.fn();
    mockCartContainsProductDbDeleteCartItemByCartIdAndProductName = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('Given customerId and productName; When deleting cart item; Then cart item is deleted and message indicating success is returned.', async() => {
    // GIVEN
    const customerId: number = 1;
    const productName: string = "Bread";

    customerDb.getCustomerById = mockCustomerDbGetCustomerById.mockReturnValue(customer);
    cartDb.getCartByCustomerId = mockCartDbGetCartByCustomerId.mockReturnValue(cart);
    cartContainsProductDb.deleteCartItemByCartIdAndProductName = mockCartContainsProductDbDeleteCartItemByCartIdAndProductName;


    // WHEN
    const returnMessage: string = await customerService.deleteCartItem({ customerId, productName });


    // THEN
    expect(mockCartContainsProductDbDeleteCartItemByCartIdAndProductName).toHaveBeenCalledTimes(1);
    expect(mockCartContainsProductDbDeleteCartItemByCartIdAndProductName).toHaveBeenCalledWith(customerId, productName);
    expect(returnMessage).toBe(`Cart item '${productName}' deleted successfully.`);
});

// Q& This test fails if the method in the service is async.
test('Given customerId that does not correspond to any customer; When deleting cart item; Then error is thrown.', () => {
    // GIVEN
    const customerId: number = 1;
    const productName: string = "Bread";
    customerDb.getCustomerById = mockCustomerDbGetCustomerById.mockReturnValue(null);

    // WHEN
    const deleteCartItem = () => customerService.deleteCartItem({ customerId, productName });

    // THEN
    expect(deleteCartItem).toThrow(`Customer with id ${customerId} does not exist.`);

});

test('Given customer has no cart; When deleting cart item; Then error is thrown.', () => {
    // GIVEN
    const customerId: number = 2;
    const productName: string = "Bread";
    customerDb.getCustomerById = mockCustomerDbGetCustomerById.mockReturnValue(customerWithoutCart);
    cartDb.getCartByCustomerId = mockCartDbGetCartByCustomerId.mockReturnValue(null);

    // WHEN
    const deleteCartItem = () => customerService.deleteCartItem({ customerId, productName });

    // THEN
    expect(deleteCartItem).toThrow(`Customer ${customerWithoutCart.getUsername()} does not have a cart.`);
});

