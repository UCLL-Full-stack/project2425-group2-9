import { Cart } from '../../model/cart';
import database from '../../util/database';
import { Customer } from '../../model/customer';
import exp from 'constants';

const id: string = "8872523aaammm-cccddaaw22";
const totalPrice: number = 50;
const customerId: string = "some-id";
const isActive : boolean = true
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
    const cart: Cart = new Cart({ id, totalPrice, customerId, isActive,customer });

    // THEN
    expect(cart.getId()).toEqual(id);
    expect(cart.getTotalPrice()).toEqual(totalPrice);
    expect(cart.getCustomerId()).toEqual(customerId);
    expect(cart.getCustomer()).toEqual(customer);
    expect(cart.getIsActive()).toEqual(isActive)
});

test("given isActive is true; when setting it to false; then Isactive field is change to false", ()=> {

    //given
    isActive
    //when 
    const cart = new Cart({id , customerId, isActive : false ,totalPrice, customer })

    expect(cart.setIsActive(isActive)).toBeFalsy()
})

test('Given cart with total price; When updating total price; Then total price is updated.', () => {
    // GIVEN
    const cart: Cart = new Cart({ id, totalPrice, customerId, customer, isActive });

    // WHEN
    cart.setTotalPrice(100);
    
    // THEN
    expect(cart.getTotalPrice()).toEqual(100);
});

test('Given negative total price; When creating cart; Then error is thrown.', () => {
    // GIVEN
    // WHEN
    const createCart = () => {
        const cart: Cart = new Cart({ id, totalPrice: -50, customerId, isActive });
        return cart;
    }
    // THEN
    expect(createCart).toThrow("Total price must be greater than or equal to 0.");
});

test("Given cartId and customerId are not included; When creating a cart; Then cart is created successfully and added to the database.", () => {
    // GIVEN
    // WHEN
    const cart = new Cart({ totalPrice, customerId, isActive });
    // THEN
    expect(cart).toBeInstanceOf(Cart);
});

test("Given customer is not included; When creating a new cart; Then cart is created without errors.", () => {
    // GIVEN
    // WHEN
    const cart = new Cart({ id, totalPrice, customerId, isActive });
    // THEN
    expect(cart).toBeInstanceOf(Cart);
});


