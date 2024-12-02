
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

    // THEN
    expect(cartContainsProduct.getCartId()).toBe(cartId);
    expect(cartContainsProduct.getProductName()).toBe(productName);
    expect(cartContainsProduct.getQuantity()).toBe(quantity);
});

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
});

