import exp from "constants";
import { Cart } from "../../model/cart";
import { CartContainsProduct } from "../../model/cartContainsProduct";
import { Customer } from "../../model/customer";
import { Product } from "../../model/product";
import cartDb from "../../repository/cart.db";
import cartContainsProductDb from "../../repository/cartContainsProduct.db";
import customerDb from "../../repository/customer.db";
import productDb from "../../repository/product.db";
import cartService from "../../service/cart.service";
// import { CartDetails } from "../../types";


// GIVEN -----------------------------------
const customer: Customer = new Customer({

    id: "some-id",
    password: "m@t3j-v3s3l",
    username: "Matej333",
    firstName: "Matej",
    lastName: "Vesel",
    phone: "333444555666"

})

const customerWithoutCart: Customer = new Customer({

    id: "2",
    password: "r0l@nd/nd1m3/s0n3",
    username: "Roland333",
    firstName: "Roland",
    lastName: "Ndime Sone",
    phone: "444555666777"

})

const customerWithoutCart2: Customer = new Customer({

    id: "2",
    password: "r0l@nd/nd1m3/s0n3",
    username: "Roland",
    firstName: "Roland",
    lastName: "Ndime Sone",
    phone: "444555666127"

})
const product : Product[] = [
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
]
const cart: Cart = new Cart({
    id: "1",
    totalPrice: 30,
    customerId: "some-id",
    customer : customer,
    
})

const cart2 :  Cart = new Cart({
    id: "2",
    totalPrice: 10,
    customerId: "2",
    customer : customerWithoutCart2,
    
})

const cartContainsProduct : CartContainsProduct = new CartContainsProduct({cartId : cart.getId()!,productName : product[0].getName(), quantity: 2})

// SETUP -----------------------------------
//class_methods related to addProductToCart method in cart.service.ts

let mockCartDb_getCartByCustomerId: jest.Mock;
let mockCustomerDb_getCustomerById: jest.Mock;
let mockCartDb_createNewCartForCustomer: jest.Mock;
let mockProductDb_getProductByName: jest.Mock;
let mockCartContainsProduct_getCartByCartIdAndProductName: jest.Mock;
let mockCartContainsProductDb_addCartItem: jest.Mock;
let mockCartContainsProductDb_updateProduct: jest.Mock;


//class_methods related to getAllCartsAvailable method 

let mockCartDb_returnAllCartsAvailable : jest.Mock;

//class_methods related to getCartContainsProductByCartId and getCartDetails methods in cart.service.ts

let mockCartContainsProductDb_returnAllItemsInCart: jest.Mock;
let mockCartContainsProductDb_calculateTotalPrice: jest.Mock;

beforeEach(() => {
    
    mockCartDb_getCartByCustomerId = jest.fn();
    mockCartDb_createNewCartForCustomer = jest.fn();
    mockCustomerDb_getCustomerById = jest.fn();
    mockProductDb_getProductByName = jest.fn();
    mockCartContainsProduct_getCartByCartIdAndProductName = jest.fn();
    mockCartContainsProductDb_addCartItem = jest.fn();
    mockCartContainsProductDb_updateProduct = jest.fn()
    mockCartDb_returnAllCartsAvailable =  jest.fn();
    mockCartContainsProductDb_returnAllItemsInCart = jest.fn();
    mockCartContainsProductDb_calculateTotalPrice = jest.fn();
});

afterEach(() => {

    jest.clearAllMocks();

});


// TESTS -----------------------------------

test(`Given cart exists for a customer and the selected product is not in the customers cart; when adding product to cart; then a new product is added to the cart`, async () => {
    // Given

    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(product[1]);
    cartContainsProductDb.getCartByCartIdAndProductName = mockCartContainsProduct_getCartByCartIdAndProductName.mockReturnValue(undefined)
    cartContainsProductDb.addCartItem = mockCartContainsProductDb_addCartItem.mockReturnValue(new CartContainsProduct({cartId: cart.getId()!, productName: product[1].getName(), quantity: 1}))

    //when

    await cartService.addProductToCart({customerId: customer.getId()!, productName: product[1].getName()})

    //then

    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId())
    expect(mockProductDb_getProductByName).toHaveBeenCalledWith(product[1].getName())
    expect(mockCartContainsProduct_getCartByCartIdAndProductName).toHaveBeenCalledWith(cart.getId(), product[1].getName())
    expect(mockCartContainsProductDb_addCartItem).toHaveBeenCalledWith({cartId : cart.getId(), productName: product[1].getName(), quantity: 1})

});

test(`Given cart exists for a customer and the selected product is in the customer's cart; When adding product to cart; Then the product's quantity is incremented by one, and the stock is reduced by one. `, async ()=> {

    //Given

    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(cart);
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(product[0]);
    cartContainsProductDb.getCartByCartIdAndProductName = mockCartContainsProduct_getCartByCartIdAndProductName.mockReturnValue(cartContainsProduct)
    cartContainsProductDb.updateProduct = mockCartContainsProductDb_updateProduct.mockImplementation(
        ((cartId , name) => new CartContainsProduct({cartId : cartId!, productName : name, quantity : cartContainsProduct.getQuantity()+1}))
    )


    //when 

    await cartService.addProductToCart({customerId: customer.getId()!, productName : product[0].getName()})

    //then

    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customer.getId())
    expect(mockProductDb_getProductByName).toHaveBeenCalledWith(product[0].getName())
    expect(mockCartContainsProduct_getCartByCartIdAndProductName).toHaveBeenCalledWith(cart.getId(), product[0].getName())
    expect(mockCartContainsProductDb_updateProduct).toHaveBeenCalledWith(  cart.getId()!, product[0].getName() )


})

test(`Given cart does not exist for an existing customer; When they want to add product o a cart; Then a new cart is created for the customer`, async() => {

    //Given 
    cartDb.getCartByCustomerId = mockCartDb_getCartByCustomerId.mockReturnValue(undefined);
    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customerWithoutCart)
    cartDb.createNewCartForCustomer = mockCartDb_createNewCartForCustomer.mockReturnValue(new Cart({ customerId: customerWithoutCart.getId(), totalPrice: product[0].getPrice(), customer: customerWithoutCart }))

    //when

    await cartService.addProductToCart({customerId : customerWithoutCart.getId()!, productName : product[0].getName()})

    //then

    expect(mockCartDb_getCartByCustomerId).toHaveBeenCalledWith(customerWithoutCart.getId())
    expect(mockCustomerDb_getCustomerById).toHaveBeenCalledWith(customerWithoutCart.getId())
    expect(mockCartDb_createNewCartForCustomer).toHaveBeenCalledWith({customerId : customerWithoutCart.getId(), totalPrice : product[0].getPrice(), customer : customerWithoutCart})

})

test("Given customer wants to add a non-existing product in a cart; When adding product to cart; Then an error is thrown.", async () => {

    //Given

    productDb.getProductByName =  mockProductDb_getProductByName.mockReturnValue(undefined);

    //when

    //when and then

    await expect(cartService.addProductToCart({customerId : customer.getId()!, productName : "some-name"}))
        .rejects
        .toThrow("Product does not exist.")
})

test("Given customer does not exist; When adding product to a cart; then error is throw.",async ()=> {

    //given 

    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(undefined)
    productDb.getProductByName = mockProductDb_getProductByName.mockReturnValue(product[0])

    // when and then

    await expect(cartService.addProductToCart({customerId : "some-id", productName : product[0].getName()}))
    .rejects
    .toThrow("Customer does not exist.")
    
})

test("Given cart was not created  for an existing customer; when creating a new cart for a customer; then an error is throw.", async () => {

    //given

    customerDb.getCustomerById = mockCustomerDb_getCustomerById.mockReturnValue(customer)
    cartDb.createNewCartForCustomer = mockCartDb_createNewCartForCustomer.mockReturnValue(undefined)

    //when and then

    await expect(cartService.addProductToCart({customerId : customer.getId()!, productName : product[0].getName()}))
    .rejects
    .toThrow("Cart was not created.")
})


test("Given carts are in the dataBase; when admin wants to check all available carts and their their contents; then a list of all available carts is returned. ", async () => {

    //Given

    cartDb.returnAllCartsAvailable = mockCartDb_returnAllCartsAvailable.mockReturnValue([cart, cart2])

    //when

    await cartService.getAllCartsAvailable()

    //then

    expect(mockCartDb_returnAllCartsAvailable).toHaveBeenCalled()
})

test("Given no carts exists in the database; when fetching carts available; Then the right error is thrown.", async () => {

    //Given

    cartDb.returnAllCartsAvailable = mockCartDb_returnAllCartsAvailable.mockReturnValue([])

    //when and then

    await expect(cartService.getAllCartsAvailable())
    .rejects
    .toThrow('Application error: Error: No carts found. Database is empty')

})

test("Given return value; when fetching available carts is undefined; The an error is thrown", async () => {

    //Given

    cartDb.returnAllCartsAvailable = mockCartDb_returnAllCartsAvailable.mockReturnValue(undefined);

    //when and then

    await expect(cartService.getAllCartsAvailable())
    .rejects
    .toThrow('Application error: Error: No carts found. Database is empty')

})

test("Given valid cart ID; When getting cart contains product by cart ID; Then cart items are returned.", async () => {
    // GIVEN
    const cartId = "2e937a99-6713-4237-86b9-817b2939fbe6";
    const product = new Product({ name: "I-phone 16 pro max", price: 1200, unit: "Euros", stock: 200, description: "The iPhone 16 Pro Max features a stunning 6.9-inch Super Retina XDR display with a resolution of 2868x1320 pixels, delivering vibrant colors and sharp details. Encased in a durable titanium design, it offers exceptional durability and a sleek look.", imagePath: "C:/Users/HOME/OneDrive/Desktop/UCLL/FULLSTACK/project2425-group2-9/back-end/images/apple_iphone-16-pro-max-256-brz_7726759_1.jpg" });
    const cartContainsProduct = new CartContainsProduct({ cartId, productName: product.getName(), quantity: 1, product });

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockResolvedValue([cartContainsProduct]);

    // WHEN
    const result = await cartService.getCartContainsProductByCartId({ cartId });

    // THEN
    expect(result).toEqual([cartContainsProduct]);
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(cartId);
});

test("Given invalid cart ID; When getting cart contains product by cart ID; Then error is thrown.", async () => {
    // GIVEN
    const cartId = "invalid-cart-id";

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockResolvedValue(undefined);

    // WHEN and THEN
    await expect(cartService.getCartContainsProductByCartId({ cartId })).rejects.toThrow("cart has no products");
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(cartId);
});

test("Given valid cart ID; When getting cart details; Then cart details are returned.", async () => {
    // GIVEN
    const cartId = "2e937a99-6713-4237-86b9-817b2939fbe6";
    const product = new Product({ name: "I-phone 16 pro max", price: 1200, unit: "Euros", stock: 200, description: "The iPhone 16 Pro Max features a stunning 6.9-inch Super Retina XDR display with a resolution of 2868x1320 pixels, delivering vibrant colors and sharp details. Encased in a durable titanium design, it offers exceptional durability and a sleek look.", imagePath: "C:/Users/HOME/OneDrive/Desktop/UCLL/FULLSTACK/project2425-group2-9/back-end/images/apple_iphone-16-pro-max-256-brz_7726759_1.jpg" });
    const cartContainsProduct = new CartContainsProduct({ cartId, productName: product.getName(), quantity: 1, product });

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockResolvedValue([cartContainsProduct]);
    cartContainsProductDb.calculateTotalPrice = mockCartContainsProductDb_calculateTotalPrice.mockResolvedValue(1200);

    // WHEN
    const result = await cartService.getCartDetails({ cartId });

    // THEN
    expect(result).toEqual([{ product: [{ cartId: cartContainsProduct.getCartId(), productName: cartContainsProduct.getProductName(), quantity: cartContainsProduct.getQuantity(), price: `$${product.getPrice()}` }], totalPrice: 1200 }]);
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(cartId);
    expect(mockCartContainsProductDb_calculateTotalPrice).toHaveBeenCalledWith({ cartId });
});

test("Given invalid cart ID; When getting cart details; Then error is thrown.", async () => {
    // GIVEN
    const cart_Id = "invalid-cart-id";

    cartContainsProductDb.returnAllItemsInCart = mockCartContainsProductDb_returnAllItemsInCart.mockResolvedValue(undefined);

    // WHEN and THEN
    await expect(cartService.getCartDetails({ cartId : cart_Id })).rejects.toThrow("cart has no products");
    expect(mockCartContainsProductDb_returnAllItemsInCart).toHaveBeenCalledWith(cart_Id);
});

