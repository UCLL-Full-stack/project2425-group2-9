import { Order } from "../../model/order";
import { Cart } from "../../model/cart";
import { Customer } from "../../model/customer";
import { set } from 'date-fns';

const date = set(new Date(), { hours: 15, minutes: 30, seconds: 20, milliseconds: 200 });
const cartId = "2e937a99-6713-4237-86b9-817b2939fbe6";
const customer = new Customer({ id: "1", username: "John Doe", firstName: "John", lastName: "Doe", password: "password123", phone: "12345678", role: "CUSTOMER" });
const cart = new Cart({ id: cartId, customerId: customer.getId(), totalPrice: 100, customer });

test("Given valid values; When creating order; Then order is created with those values.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const order = new Order({ id: 1, date, cartId, cart, customer });

    // THEN
    expect(order.getDate()).toEqual(date); // use toEqual for date validation
    expect(order.getCartId()).toBe(cartId);
    expect(order.getCart()).toBe(cart);
    expect(order.getCustomer()).toBe(customer);
});

test("Given no date; When creating order; Then error is thrown.", () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createOrder = () => new Order({ id: 1, cartId, cart, customer });

    // THEN
    expect(createOrder).toThrow("Date is required.");
});

test("Given invalid date; When creating order; Then error is thrown.", () => {
    // GIVEN
    const invalidDate = new Date('');

    // WHEN
    const createOrder = () => new Order({ id: 1, date: invalidDate, cartId, cart, customer });

    // THEN
    expect(createOrder).toThrow("Date is not valid.");
});

test("Given future date; When creating order; Then error is thrown.", () => {
    // GIVEN
    const futureDate = set(new Date(), { year: 2100 });

    // WHEN
    const createOrder = () => new Order({ id: 1, date: futureDate, cartId, cart, customer });

    // THEN
    expect(createOrder).toThrow("order date cannot be in the future");
});

test("Given valid values; When comparing two orders; Then they are equal.", () => {
    // GIVEN
    const order1 = new Order({ id: 1, date, cartId, cart, customer });
    const order2 = new Order({ id: 1, date, cartId, cart, customer });

    // WHEN
    const isEqual = order1.equals(order2);

    // THEN
    expect(isEqual).toBe(true);
});

test("Given different values; When comparing two orders; Then they are not equal.", () => {
    // GIVEN
    const order1 = new Order({ id: 1, date, cartId, cart, customer });
    const differentCart = new Cart({ id: "differentCartId", customerId: customer.getId(), totalPrice: 200, customer });
    const order2 = new Order({ id: 1, date, cartId: "differentCartId", cart: differentCart, customer });

    // WHEN
    const isEqual = order1.equals(order2);

    // THEN
    expect(isEqual).toBe(false);
});

test("Given valid values; When setting new date; Then date is updated.", () => {
    // GIVEN
    const order = new Order({ id: 1, date, cartId, cart, customer });
    const newDate = set(new Date(), { hours: 10, minutes: 20, seconds: 30, milliseconds: 400 });

    // WHEN
    order.setDate(newDate);

    // THEN
    expect(order.getDate()).toEqual(newDate);
});

test("Given valid values; When setting new cart; Then cart is updated.", () => {
    // GIVEN
    const order = new Order({ id: 1, date, cartId, cart, customer });
    const newCart = new Cart({ id: "newCartId", customerId: customer.getId(), totalPrice: 150, customer });

    // WHEN
    order.setCart(newCart);

    // THEN
    expect(order.getCart()).toBe(newCart);
});

// test("Given valid values; When setting new customer; Then customer is updated.", () => {
//     // GIVEN
//     const order = new Order({ id: 1, date, cartId, cart, customer });
//     const newCustomer = new Customer({ id: "2", username: "Jane Doe", firstName: "Jane", lastName: "Doe", password: "password456", phone: "87654321", });

//     // WHEN
//     order.setCustomer(newCustomer);

//     // THEN
//     expect(order.getCustomer()).toBe(newCustomer);
// });

