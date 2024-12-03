import { Cart } from '../../model/cart';

const id: number = 8872523;
const totalPrice: number = 50;
const customerId: number = 522567;
<<<<<<< HEAD
   
=======
>>>>>>> 6913e423f295a49071dd6922709f3b637d77f35d

// Q&A Do we have to write given when then with colons and semi-colons? A: Doesn't matter as long as it's clear.
test('Given valid values; When creating a cart; Then cart is created with those values.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const cart: Cart = new Cart({ id, totalPrice, customerId});

    // THEN
    expect(cart.getId()).toEqual(id);
    expect(cart.getTotalPrice()).toEqual(totalPrice);
    expect(cart.getCustomerId()).toEqual(customerId);
<<<<<<< HEAD
    });

test('Given cart with total price; When updating total price; Then total price is updated.', () => {
    // GIVEN
    const cart: Cart = new Cart({ id, totalPrice, customerId });

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
    expect(createCart).toThrow("Total price must be greater or equal to than zero.");

});
=======
});

test('Given cart with negative total price; When creating a cart; Then error is thrown.', () => {
    // GIVEN
    // Values at the top of this file.

    // WHEN
    const createCart = () => new Cart({ id, totalPrice: -50, customerId });

    // THEN
    expect(createCart).toThrow("Total price must be non-negative.");
});
>>>>>>> 6913e423f295a49071dd6922709f3b637d77f35d
