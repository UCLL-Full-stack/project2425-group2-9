import { Cart } from "../../model/cart";
import { CartContainsProduct } from "../../model/cartContainsProduct";
import { Customer } from "../../model/customer";
import { Product } from "../../model/product";
import cartDb from "../../repository/cart.db";
import cartContainsProductDb from "../../repository/cartContainsProduct.db";
import customerDb from "../../repository/customer.db";
import productDb from "../../repository/product.db";
import cartService from "../../service/cart.service";
import { AddToCartInput, CartDetails } from "../../types";

// GIVEN -----------------------------------
const customer: Customer = new Customer({
    id: "some-id",
    password: "m@t3j-v3s3l",
    username: "Matej333",
    firstName: "Matej",
    lastName: "Vesel",
    phone: "333444555666"
});

const customerWithoutCart: Customer = new Customer({
    id: "2",
    password: "r0l@nd/nd1m3/s0n3",
    username: "Roland333",
    firstName: "Roland",
    lastName: "Ndime Sone",
    phone: "444555666777"
});

const product: Product[] = [
    new Product({
        name: "Bread",
        price: 5,
        unit: "piece",
        stock: 25,
        description: "Rye bread is a type of bread made with various proportions of flour from rye grain. It can be light or dark in color, depending on the type of flour used and the addition of coloring agents, and is typically denser than bread made from wheat flour. Compared to white bread, it is higher in fiber, darker in color, and stronger in flavor. The world's largest exporter of rye bread is Poland.",
        imagePath: "bread.png"
    }),
    new Product({
        name: "Mayonnaise",
        price: 7,
        unit: "piece",
        stock: 15,
        description: "Mayonnaise is an emulsion of oil, egg yolk, and an acid, either vinegar or lemon juice;[4] there are many variants using additional flavorings. The color varies from near-white to pale yellow, and its texture from a light cream to a thick gel.",
        imagePath: "mayonnaise.png"
    })
];

const cart: Cart = new Cart({
    id: "1",
    totalPrice: 30,
    customerId: "some-id",
    customer: customer,
    isActive: true
});

const cartContainsProduct: CartContainsProduct = new CartContainsProduct({
    cartId: cart.getId()!,
    productName: product[0].getName(),
    quantity: 2
});

const cart2: Cart = new Cart({
    id: "2",
    totalPrice: 50,
    customerId: "some-other-id",
    customer: customer,
    isActive: true
});

// SETUP -----------------------------------
// Class methods related to addProductToCart method in cart.service.ts
let mockCartDb_getCartByCustomerId: jest.Mock;
let mockCustomerDb_getCustomerById: jest.Mock;
let mockCartDb_createNewCartForCustomer: jest.Mock;
let mockProductDb_getProductByName: jest.Mock;
let mockCartContainsProduct_getCartByCartIdAndProductName: jest.Mock;
let mockCartContainsProductDb_addCartItem: jest.Mock;
let mockCartContainsProductDb_updateProduct: jest.Mock;
let mockCartContainsProductDb_calculateTotalPrice: jest.Mock;
let mockCartDb_updateCartTotalPrice: jest.Mock;
let mockCartDb_getCartById: jest.Mock;

// Class methods related to getAllCartsAvailable method
let mockCartDb_returnAllCartsAvailable: jest.Mock;

// Class methods related to getCartContainsProductByCartId and getCartDetails methods in cart.service.ts
let mockCartContainsProductDb_returnAllItemsInCart: jest.Mock;

beforeEach(() => {
    mockCartDb_getCartByCustomerId = jest.fn();
    mockCartDb_createNewCartForCustomer = jest.fn();
    mockCustomerDb_getCustomerById = jest.fn();
    mockProductDb_getProductByName = jest.fn();
    mockCartContainsProduct_getCartByCartIdAndProductName = jest.fn();
    mockCartContainsProductDb_addCartItem = jest.fn();
    mockCartContainsProductDb_updateProduct = jest.fn();
    mockCartContainsProductDb_calculateTotalPrice = jest.fn();
    mockCartDb_updateCartTotalPrice = jest.fn();
    mockCartDb_getCartById = jest.fn();
    mockCartDb_returnAllCartsAvailable = jest.fn();
    mockCartContainsProductDb_returnAllItemsInCart = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

// TESTS -----------------------------------

test(`Given cart exists for a customer and the selected product is not in the customer's cart; when adding product to cart; then a new product is added to the cart`, async () => {
    // Given
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(product[1]);
    cartContainsProductDb.getCartByCartIdAndProductName = mockCartContainsProduct_getCartByCartIdAndProductName.mockReturnValue(undefined);
    cartContainsProductDb.addCartItem = mockCartContainsProductDb_addCartItem.mockReturnValue(new CartContainsProduct({ cartId: cart.getId()!, productName: product[1].getName(), quantity: 1 }));
    cartContainsProductDb.calculateTotalPrice = mockCartContainsProductDb_calculateTotalPrice.mockReturnValue(37);
    cartDb.updateCartTotalPrice = mockCartDb_updateCartTotalPrice.mockReturnValue(undefined);
    cartDb.getCartById = mockCartDb_getCartById.mockReturnValue(cart);

    // When
    await cartService.addProductToCart({ customerId: customer.getId()!, productName: product[1].getName() });

    // Then
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());
    expect(mockProductDb_getProductByName).toHaveBeenCalledWith(product[1].getName());
    expect(mockCartContainsProduct_getCartByCartIdAndProductName).toHaveBeenCalledWith(cart.getId(), product[1].getName());
    expect(mockCartContainsProductDb_addCartItem).toHaveBeenCalledWith(expect.objectContaining({ cartId: cart.getId(), productName: product[1].getName(), quantity: 1 }));
    expect(mockCartContainsProductDb_calculateTotalPrice).toHaveBeenCalledWith({ cartId: cart.getId() });
    expect(mockCartDb_updateCartTotalPrice).toHaveBeenCalledWith(cart.getId(), 37);
    expect(mockCartDb_getCartById).toHaveBeenCalledWith(cart.getId());
});

test(`Given cart exists for a customer and the selected product is in the customer's cart; When adding product to cart; Then the product's quantity is incremented by one, and the stock is reduced by one.`, async () => {
    // Given
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(product[0]);
    cartContainsProductDb.getCartByCartIdAndProductName = mockCartContainsProduct_getCartByCartIdAndProductName.mockReturnValue(cartContainsProduct);
    cartContainsProductDb.updateProduct = mockCartContainsProductDb_updateProduct.mockImplementation(
        (cartId, name) => new CartContainsProduct({ cartId: cartId!, productName: name, quantity: cartContainsProduct.getQuantity() + 1 })
    );
    cartContainsProductDb.calculateTotalPrice = mockCartContainsProductDb_calculateTotalPrice.mockReturnValue(35);
    cartDb.updateCartTotalPrice = mockCartDb_updateCartTotalPrice.mockReturnValue(undefined);
    cartDb.getCartById = mockCartDb_getCartById.mockReturnValue(cart);

    // When
    await cartService.addProductToCart({ customerId: customer.getId()!, productName: product[0].getName() });

    // Then
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId());
    expect(mockProductDb_getProductByName).toHaveBeenCalledWith(product[0].getName());
    expect(mockCartContainsProduct_getCartByCartIdAndProductName).toHaveBeenCalledWith(cart.getId(), product[0].getName());
    expect(mockCartContainsProductDb_updateProduct).toHaveBeenCalledWith(cart.getId()!, product[0].getName());
    expect(mockCartContainsProductDb_calculateTotalPrice).toHaveBeenCalledWith({ cartId: cart.getId() });
    expect(mockCartDb_updateCartTotalPrice).toHaveBeenCalledWith(cart.getId(), 35);
    expect(mockCartDb_getCartById).toHaveBeenCalledWith(cart.getId());
});

test(`Given cart does not exist for an existing customer; When they want to add product to a cart; Then a new cart is created for the customer`, async () => {
    // Given
    const newCart = new Cart({ customerId: customerWithoutCart.getId()!, totalPrice: product[0].getPrice(), customer: customerWithoutCart, isActive: true });
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(undefined);
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customerWithoutCart);
    cartDb.createNewCartForCustomer = mockCartDb_createNewCartForCustomer.mockReturnValue(newCart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(product[0]);
    cartContainsProductDb.addCartItem = mockCartContainsProductDb_addCartItem.mockReturnValue(new CartContainsProduct({ cartId: newCart.getId()!, productName: product[0].getName(), quantity: 1 }));
    cartContainsProductDb.calculateTotalPrice = mockCartContainsProductDb_calculateTotalPrice.mockReturnValue(5);
    cartDb.updateCartTotalPrice = mockCartDb_updateCartTotalPrice.mockReturnValue(undefined);
    cartDb.getCartById = mockCartDb_getCartById.mockReturnValue(newCart);

    // When
    const result = await cartService.addProductToCart({ customerId: customerWithoutCart.getId()!, productName: product[0].getName() });

    // Then
    expect(result).toEqual(newCart);
    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customerWithoutCart.getId());
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customerWithoutCart.getId());
    expect(mockCartDb_createNewCartForCustomer).toHaveBeenCalledWith(expect.objectContaining({ customerId: customerWithoutCart.getId(), totalPrice: product[0].getPrice(), customer: customerWithoutCart }));
    expect(mockProductDb_getProductByName).toHaveBeenCalledWith(product[0].getName());
    expect(mockCartContainsProductDb_addCartItem).toHaveBeenCalledWith(expect.objectContaining({ cartId: newCart.getId(), productName: product[0].getName(), quantity: 1 }));
    expect(mockCartContainsProductDb_calculateTotalPrice).toHaveBeenCalledWith({ cartId: newCart.getId() });
    expect(mockCartDb_updateCartTotalPrice).toHaveBeenCalledWith(newCart.getId(), 5);
    expect(mockCartDb_getCartById).toHaveBeenCalledWith(newCart.getId());
});

test("Given customer wants to add a non-existing product in a cart; When adding product to cart; Then an error is thrown.", async () => {
    // Given
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(undefined);

    // When and Then
    await expect(cartService.addProductToCart({ customerId: customer.getId()!, productName: "some-name" }))
        .rejects
        .toThrow("Product does not exist.");
});




test("Given carts are in the database; when admin wants to check all available carts and their contents; then a list of all available carts is returned.", async () => {
    // Given
    cartDb.returnAllCartsAvailable = mockCartDb_returnAllCartsAvailable.mockReturnValue([cart, cart2]);

    // When
    const result = await cartService.getAllCartsAvailable();

    // Then
    expect(result).toEqual([cart, cart2]);
    expect(mockCartDb_returnAllCartsAvailable).toHaveBeenCalled();
});

test("Given no carts exist in the database; when fetching carts available; Then the right error is thrown.", async () => {
    // Given
    cartDb.returnAllCartsAvailable = mockCartDb_returnAllCartsAvailable.mockReturnValue([]);

    // When and Then
    await expect(cartService.getAllCartsAvailable())
        .rejects
        .toThrow('Application error: Error: No carts found. Database is empty');
});

test("Given return value; when fetching available carts is undefined; Then an error is thrown.", async () => {
    // Given
    cartDb.returnAllCartsAvailable = mockCartDb_returnAllCartsAvailable.mockReturnValue(undefined);

    // When and Then
    await expect(cartService.getAllCartsAvailable())
        .rejects
        .toThrow('Application error: Error: No carts found. Database is empty');
});

test("Given valid cart ID; When getting cart contains product by cart ID; Then cart items are returned.", async () => {
    // Given
    const cartId = "2e937a99-6713-4237-86b9-817b2939fbe6";
    const product = new Product({ name: "I-phone 16 pro max", price: 1200, unit: "Euros", stock: 200, description: "The iPhone 16 Pro Max features a stunning 6.9-inch Super Retina XDR display with a resolution of 2868x1320 pixels, delivering vibrant colors and sharp details. Encased in a durable titanium design, it offers exceptional durability and a sleek look.", imagePath: "C:/Users/HOME/OneDrive/Desktop/UCLL/FULLSTACK/project2425-group2-9/back-end/images/apple_iphone-16-pro-max-256-brz_7726759_1.jpg" });
    const cartContainsProduct = new CartContainsProduct({ cartId, productName: product.getName(), quantity: 1, product });

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockResolvedValue([cartContainsProduct]);

    // When
    const result = await cartService.getCartContainsProductByCartId({ cartId });

    // Then
    expect(result).toEqual([cartContainsProduct]);
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(cartId);
});

test("Given invalid cart ID; When getting cart contains product by cart ID; Then error is thrown.", async () => {
    // Given
    const cartId = "invalid-cart-id";

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockResolvedValue(undefined);

    // When and Then
    await expect(cartService.getCartContainsProductByCartId({ cartId })).rejects.toThrow("cart has no products");
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(cartId);
});

test("Given valid cart ID; When getting cart details; Then cart details are returned.", async () => {
    // Given
    const cartId = "2e937a99-6713-4237-86b9-817b2939fbe6";
    const product = new Product({ name: "I-phone 16 pro max", price: 1200, unit: "Euros", stock: 200, description: "The iPhone 16 Pro Max features a stunning 6.9-inch Super Retina XDR display with a resolution of 2868x1320 pixels, delivering vibrant colors and sharp details. Encased in a durable titanium design, it offers exceptional durability and a sleek look.", imagePath: "C:/Users/HOME/OneDrive/Desktop/UCLL/FULLSTACK/project2425-group2-9/back-end/images/apple_iphone-16-pro-max-256-brz_7726759_1.jpg" });
    const cartContainsProduct = new CartContainsProduct({ cartId, productName: product.getName(), quantity: 1, product });

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockResolvedValue([cartContainsProduct]);
    cartContainsProductDb.calculateTotalPrice = mockCartContainsProductDb_calculateTotalPrice.mockResolvedValue(1200);

    // When
    const result = await cartService.getCartDetails({ customerId: customer.getId()! });

    // Then
    expect(result).toEqual([{ product: [{ cartId: cartContainsProduct.getCartId(), productName: cartContainsProduct.getProductName(), quantity: cartContainsProduct.getQuantity(), price: `$${product.getPrice()}` }], totalPrice: 1200 }]);
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(cartId);
    expect(mockCartContainsProductDb_calculateTotalPrice).toHaveBeenCalledWith({ cartId });
});

