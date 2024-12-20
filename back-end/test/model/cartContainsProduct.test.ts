import { Cart } from "../../model/cart";
import { CartContainsProduct } from "../../model/cartContainsProduct";
import { Product } from "../../model/product";

const cartId: string = "some-string";
const productName: string = "Bananas";
const quantity: number = 0;
const cart: Cart = new Cart({ id: "some-string", totalPrice: 0 , isActive : true});
const product: Product = new Product({
    name: "bananas",
    price: 1.0,
    unit: "kg",
    stock: 100,
    description: "Fresh bananas",
    imagePath: "path/to/image"
});

test('Given valid values; When creating CartContainsProduct object; Then object is created with those values.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const cartContainsProduct: CartContainsProduct = new CartContainsProduct({ cartId, productName, quantity, cart, product });

    // THEN
    expect(cartContainsProduct.getCartId()).toBe(cartId);
    expect(cartContainsProduct.getProductName()).toBe(productName);
    expect(cartContainsProduct.getQuantity()).toBe(quantity);
    expect(cartContainsProduct.getCart()).toEqual(cart);
    expect(cartContainsProduct.getProduct()).toEqual(product);
});

test("Given no product name; When creating cartContainsProduct object; Then error is thrown.", () => {
    // GIVEN
    const productName: string = "";

    // WHEN
    const createCart = () => {
        const cartContainsProduct: CartContainsProduct = new CartContainsProduct({
            cartId,
            productName,
            quantity
        });
        return cartContainsProduct;
    };

    // THEN
    expect(createCart).toThrow('Product name is required.');
});

test("Given no quantity; When creating cartContainsProduct object; Then error is thrown.", () => {
    // GIVEN
    const quantity: number = -50;

    // WHEN
    const createCart = () => {
        const cartContainsProduct: CartContainsProduct = new CartContainsProduct({
            cartId,
            productName,
            quantity
        });
        return cartContainsProduct;
    };

    // THEN
    expect(createCart).toThrow('Quantity must be non-negative.');
});

// test('Given no product name; When creating CartContainsProduct object; Then error is thrown.', () => {
//     // GIVEN 
//     // Values at the top of this file.

//     // WHEN
//     const createCartContainsProduct = () => new CartContainsProduct({ cartId, productName: "", quantity });

//     // THEN
//     expect(createCartContainsProduct).toThrow("Product name is required.");
// });

test('Given negative quantity; When creating CartContainsProduct object; Then error is thrown.', () => {
    // GIVEN 
    // Values at the top of this file.

    // WHEN
    const createCartContainsProduct = () => new CartContainsProduct({ cartId, productName, quantity: -10 });

    // THEN
    expect(createCartContainsProduct).toThrow("Quantity must be non-negative.");
});

// test("Given cart does not match the cartId of cartContainsProduct; when creating a new cartContainsProductObject; then error is thrown.", () => {
//     // GIVEN
//     const cart1 = new Cart({ id: "blHM409UUNKNK", totalPrice: 0 });

//     // WHEN
//     const newCartContains = () => {
//         const newCartItem = new CartContainsProduct({ cartId, productName, quantity, cart: cart1 });
//         return newCartItem;
//     };

//     // THEN
//     expect(newCartContains).toThrow("cart does not match cartId");
// });

// test("Given product does not match the given product name; When creating a new cartContainsProduct object; then an error error is thrown.", () => {
//     // GIVEN
//     const product: Product = new Product({
//         name: "apples",
//         price: 1.0,
//         unit: "kg",
//         stock: 100,
//         description: "Fresh apples",
//         imagePath: "path/to/image"
//     });

//     // WHEN
//     const newCartContains = () => {
//         const cartContainsProduct = new CartContainsProduct({
//             cartId, productName, quantity, cart, product
//         });

//         return cartContainsProduct;
//     };

//     // THEN
//     expect(newCartContains).toThrow("product does not match the product name");
// });