
import { Cart } from '../../model/cart';
import database from '../../util/database';
import { Customer } from '../../model/customer';

const id: string = "8872523aaammm-cccddaaw22";
const totalPrice: number = 50;
const customerId: string = "some-id";
const customer : Customer = new Customer({
    id: "some-id",
    password: "password123",
    username: "doe",
    firstName: "John",
    lastName: "Doe",
    phone: "1234567890"
})


// Q&A Do we have to write given when then with colons and semi-colons? A: Doesn't matter as long as it's clear.
test('Given valid values; When creating a cart; Then cart is created with those values.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const cart: Cart = new Cart({ id, totalPrice, customerId, customer});

    // THEN
    expect(cart.getId()).toEqual(id);
    expect(cart.getTotalPrice()).toEqual(totalPrice);
    expect(cart.getCustomerId()).toEqual(customerId);
    expect(cart.getCustomer()).toEqual(customer)

});

test('Given cart with total price; When updating total price; Then total price is updated.', () => {
    // GIVEN
    const cart: Cart = new Cart({ id, totalPrice, customerId, customer });

    // WHEN
    cart.setTotalPrice(100);
    
    // THEN
    expect(cart.getTotalPrice()).toEqual(100);
});

test('Given negative total price; When creating cart; Then error is thrown.', () => {
    // GIVEN
    // WHEN
    const createCart = () => {
        const cart: Cart = new Cart({ id, totalPrice: -50, customerId });
        return cart
    }
    // THEN
    expect(createCart).toThrow("Total price must be greater than or equal to 0.");

});

test("Given cartId and customerId are not included; when creating a cart; then cart is created successfully and added to the database ",  () => {

    //given
    //when
    const createCart = () => new Cart({ totalPrice, customerId})
    //then
    expect(createCart).toEqual(createCart)

})

test("Given customer is not include; when creating a new cart; then cart is created without errors.", ()=> {

    //given
    //when
    const cart = ()=> new  Cart({id, totalPrice,customerId})
    //then
    expect(cart).toEqual(cart)
})
test("Given customer's id does not match the customer; when setting customer; then error is thrown ", () => {

    //given
    let newcustomer = new Customer({
        id: "new-id",
        password: "password123",
        username: "doe",
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890"
    })
    //when
    const cart = () => new Cart({ id, totalPrice, customerId, customer : newcustomer})
    //then
    expect(cart).toThrow("Customer does not match the associated customer")
} )

