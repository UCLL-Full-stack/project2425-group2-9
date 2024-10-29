import { Cart } from '../../model/cart';
const id: number = 8872523;
    const totalPrice: number = 50;
    const customerId: number = 522567;
   

// Q&A Do we have to write given when then with colons and semi-colons? A: Doesn't matter as long as it's clear.
test('given: valid values; when: creating a cart; then: cart is created with those values.', () => {
    // GIVEN 
    const id: number = 8872523;
    const totalPrice: number = 50;
    const customerId: number = 522567;

    // WHEN
    const cart: Cart = new Cart({ id, totalPrice: totalPrice, customerId: customerId });

    // THEN
    expect(cart.getId()).toEqual(id);
    expect(cart.getTotalPrice()).toEqual(totalPrice);
    expect(cart.getCustomerId()).toEqual(customerId);

});

test('given: cart with total price; when: updating total price; then: total price is updated', () => {
    // GIVEN
    const cart: Cart = new Cart({ id, totalPrice, customerId });
    // WHEN
    cart.setTotalPrice(100);
    // THEN
    expect(cart.getTotalPrice()).toEqual(100);
});

test('given: cart with customer ID; when: updating customer ID; then: customer ID is updated', () => {
    // GIVEN
    const cart: Cart = new Cart({ id, totalPrice, customerId});
    // WHEN
    cart.setCustomerId(999999);
    // THEN
    expect(cart.getCustomerId()).toEqual(999999);
});
test("given: cart id is undefined, when: creating a cart, then an id is assigned to cart",()=>{
    //given
    const cart = new Cart({totalPrice, customerId})
    //when
    cart.setId(23000)
    //then
    expect(cart.getId()).toEqual(23000)
    
})