<<<<<<< HEAD

import { CartContainsProduct } from "../../model/cartContainsProduct";

test('Given valid values; When creating cartContainsProduct object; Then the object is creating with those values.', () => {
    // GIVEN
    const cartId: number = 1;
    const productName: string = "Bananas";
    const quantity: number = 1;

    // WHEN
    const cartContainsProduct: CartContainsProduct = new CartContainsProduct({
        cartId,
        productName,
        quantity
    });
=======
import { CartContainsProduct } from "../../model/cartContainsProduct";

const cartId: number = 1;
const productName: string = "Bananas";
const quantity: number = 0;

test('Given valid values; When creating CartContainsProduct object; Then object is created with those values.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const cartContainsProduct: CartContainsProduct = new CartContainsProduct({ cartId, productName, quantity });
>>>>>>> 6913e423f295a49071dd6922709f3b637d77f35d

    // THEN
    expect(cartContainsProduct.getCartId()).toBe(cartId);
    expect(cartContainsProduct.getProductName()).toBe(productName);
    expect(cartContainsProduct.getQuantity()).toBe(quantity);
});

<<<<<<< HEAD
test("Given no product name; When creating cartContainsProduct object; Then error is thrown.", () => {
    // GIVEN
    const cartId: number = 1;
    const productName: string = "";
    const quantity: number = 1;

    // WHEN
    const createCart = () => {
        const cartContainsProduct: CartContainsProduct = new CartContainsProduct({
            cartId,
            productName,
            quantity
        });
        return cartContainsProduct
    }

    // THEN
    expect(createCart).toThrow('Product name is required.');
});

test("Given no quantity; When creating cartContainsProduct object; Then error is thrown.", () => {
    // GIVEN
    const cartId: number = 1;
    const productName: string = "Bananas";
    const quantity: number = -50;

    // WHEN
    const createCart = () => {
        const cartContainsProduct: CartContainsProduct = new CartContainsProduct({
            cartId,
            productName,
            quantity
        });
        return cartContainsProduct
    }

    // THEN
    expect(createCart).toThrow('Quantity must be non-negative.');
=======
test('Given no product name; When creating CartContainsProduct object; Then error is thrown.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const createCartContainsProduct = () => new CartContainsProduct({ cartId, productName: "", quantity });

    // THEN
    expect(createCartContainsProduct).toThrow("Product name is required.");
});

test('Given negative quantity; When creating CartContainsProduct object; Then error is thrown.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const createCartContainsProduct = () => new CartContainsProduct({ cartId, productName, quantity: -10 });

    // THEN
    expect(createCartContainsProduct).toThrow("Quantity must be non-negative.");
>>>>>>> 6913e423f295a49071dd6922709f3b637d77f35d
});

