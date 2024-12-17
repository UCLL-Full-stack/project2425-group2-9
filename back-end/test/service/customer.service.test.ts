import { Customer } from "../../model/customer";
import { Cart } from "../../model/cart";
import customerService from "../../service/customer.service";
import customerDb from "../../repository/customer.db";
import cartDb from "../../repository/cart.db";
import cartContainsProductDb from "../../repository/cartContainsProduct.db";
import bcrypt from 'bcrypt';
import { Role } from "@prisma/client";

// Mock dependencies
jest.mock("../../repository/customer.db");
jest.mock("../../repository/cart.db");
jest.mock("../../repository/cartContainsProduct.db");
jest.mock('bcrypt');

// GIVEN -----------------------------------
const customer: Customer = new Customer({
    id: "some-id",
    password: "password",
    username: "username",
    firstName: "First",
    lastName: "Last",
    phone: "1234567890",
    role: Role.CUSTOMER
});

const cart: Cart = new Cart({
    id: "cart-id",
    totalPrice: 100,
    customerId: "some-id",
    customer: customer
});

// SETUP -----------------------------------
let mockCustomerDb_getCustomerById: jest.Mock;
let mockCartDb_getCartByCustomerId: jest.Mock;
let mockCartContainsProductDb_deleteCartItemByCartIdAndProductName: jest.Mock;
let mockCartContainsProductDb_deleteAllCartItems: jest.Mock;
let mockCustomerDb_findCustomerByUserName: jest.Mock;
let mockBcrypt_hash: jest.Mock;
let mockCustomerDb_registerCustomer: jest.Mock;
let mockBcrypt_compare: jest.Mock;

beforeEach(() => {
    mockCustomerDb_getCustomerById = jest.fn();
    mockCartDb_getCartByCustomerId = jest.fn();
    mockCartContainsProductDb_deleteCartItemByCartIdAndProductName = jest.fn();
    mockCartContainsProductDb_deleteAllCartItems = jest.fn();
    mockCustomerDb_findCustomerByUserName = jest.fn();
    mockBcrypt_hash = jest.fn();
    mockCustomerDb_registerCustomer = jest.fn();
    mockBcrypt_compare = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

// TESTS -----------------------------------
test("Given customer and cart exist; When deleting a cart item; Then the item is deleted successfully.", async () => {
    // Given
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockResolvedValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockResolvedValue(cart);
    cartContainsProductDb.deleteCartItemByCartIdAndProductName = mockCartContainsProductDb_deleteCartItemByCartIdAndProductName.mockResolvedValue("items deleted successfully");

    // When
    const result = await customerService.deleteCartItem({ customerId: customer.getId()!, productName: "product-name" });

    // Then
    expect(result).toBe(`Cart item 'product-name' deleted successfully.`);
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customer.getId());
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());
    expect(mockCartContainsProductDb_deleteCartItemByCartIdAndProductName).toHaveBeenCalledWith(cart.getId(), "product-name");
});

test("Given customer does not exist; When deleting a cart item; Then an error is thrown.", async () => {
    // Given
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockResolvedValue(null);

    // When and Then
    await expect(customerService.deleteCartItem({ customerId: "invalid-id", productName: "product-name" }))
        .rejects
        .toThrow("Customer with id invalid-id does not exist.");
});

test("Given customer and cart exist; When deleting all cart items; Then all items are deleted successfully.", async () => {
    // Given
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockResolvedValue(customer);
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockResolvedValue(cart);
    cartContainsProductDb.deleteAllCartItems = mockCartContainsProductDb_deleteAllCartItems.mockResolvedValue("All cart items deleted successfully.");

    // When
    const result = await customerService.deleteAllCartItems(customer.getId()!);

    // Then
    expect(result).toBe("All cart items deleted successfully.");
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customer.getId());
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());
    expect(mockCartContainsProductDb_deleteAllCartItems).toHaveBeenCalledWith(cart.getId());
});

test("Given valid customer input; When registering a new customer; Then the customer is registered successfully.", async () => {
    // Given
    const customerInput = {
        password: "password",
        firstName: "First",
        lastName: "Last",
        username: "username",
        phone: "1234567890",
        role: Role.CUSTOMER
    };
    const hashedPassword = "hashedPassword";
    const newCustomer = new Customer({ ...customerInput, password: hashedPassword });

    customerDb.findCustomerByUserName = mockCustomerDb_findCustomerByUserName.mockResolvedValue(undefined);
    bcrypt.hash = mockBcrypt_hash.mockResolvedValue(hashedPassword);
    customerDb.registerCustomer = mockCustomerDb_registerCustomer.mockResolvedValue(newCustomer);

    // When
    const result = await customerService.registerCustomer(customerInput);

    // Then
    expect(result).toEqual(newCustomer);
    expect(mockCustomerDb_findCustomerByUserName).toHaveBeenCalledWith({ username: customerInput.username });
    expect(mockBcrypt_hash).toHaveBeenCalledWith(customerInput.password, 12);
    expect(mockCustomerDb_registerCustomer).toHaveBeenCalledWith(newCustomer);
});

test("Given valid credentials; When authenticating a customer; Then the customer is authenticated successfully.", async () => {
    // Given
    const customerInput = {
        username: "username",
        password: "password",
        role: Role.CUSTOMER
    };
    const customer = new Customer({ ...customerInput, password: "hashedPassword", firstName: "First", lastName: "Last", phone: "1234567890" });

    customerDb.findCustomerByUserName = mockCustomerDb_findCustomerByUserName.mockResolvedValue([customer]);
    bcrypt.compare = mockBcrypt_compare.mockResolvedValue(true);

    // When
    const result = await customerService.authenticate(customerInput);

    // Then
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("username", customerInput.username);
    expect(result).toHaveProperty("role", customerInput.role);
    expect(result).toHaveProperty("fullname", `${customer.getFirstName()} ${customer.getLastName()}`);
});

// ...additional tests for other methods...
