

import exp from "constants"
import { Cart } from "../../model/cart"
import { Customer } from "../../model/customer"
import cartDb from "../../repository/cart.db"
import customerDb from "../../repository/customer.db"
import cartService from "../../service/cart.service"
import { Product } from "../../model/product"
import productDb from "../../repository/product.db"
import { CartContainsProduct } from "../../model/cartContainsProduct"
import cartContainsProductDb from "../../repository/cartContainsProduct.db"

const id:number|undefined = 3
const idOfNonExistenceCustomer:number|undefined = 4
const customer1:Customer = new Customer({
    id: 2,
    password: "m@t3j-v3s3l",
    securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
    username: "Matej333",
    firstName: "Matej",
    lastName: "Vesel",
    phone: 333444555666
})
const customer2:Customer =  new Customer({
    id: 3,
    password: "m@t3j-v3s3l",
    securityQuestion: "What is the name of the best friend from childhood?", // TODO: We also need security answer. It may also be a list.
    username: "Matej333",
    firstName: "Matej",
    lastName: "Vesel",
    phone: 333444555666
})
const cart:Cart[]  =[
    new Cart({
        id:1,
        customerId:customer1.getId(),
        totalPrice:200
    }),new Cart({
        id:2,
        customerId:customer2.getId(),
        totalPrice:0
    })]

const products:Product[]= [
    new Product({
        name:"Bread",
        price:23,
        unit:"piece",
        stock:30,
        description:"brown bread is the best",
        imagePath:"./images.bread.png"
    }),
    new Product({
        name:"Bread",
        price:23,
        unit:"piece",
        stock:30,
        description:"brown bread is the best",
        imagePath:"./images.bread.png"
    }),new Product({
        name:"Laptop",
        price:23,
        unit:"piece",
        stock:30,
        description:"brown bread is the best",
        imagePath:"./images.bread.png"
    }),
    
    
]
const cartContainsProduct:CartContainsProduct[] = [new CartContainsProduct({cartId:1,productName:"Bread",quantity:2}),
    new CartContainsProduct({cartId:1,quantity:1})
]
//mock setup for createNewCart method
let createNewCart:jest.Mock
let mockCustomerDbGetCustomerById:jest.Mock
let mockCartDbGetCartByCustomerId:jest.Mock
let mockCartDnReturnAllCartsAvailable:jest.Mock
let mockCartDbSaveCart:jest.Mock

//mock setup for addProductToCart method
let addProductsToCart:jest.Mock
let mockProductDbGetProductByName:jest.Mock
let mockCartContainsProductGetCartByCartIdAndProductName:jest.Mock
let mockCartContainsProductAddOrUpdateProduct:jest.Mock
let mockProductDbGetOrSaveProductByByName:jest.Mock
beforeEach(()=>{
    //createNewCart
    mockCartDbGetCartByCustomerId = jest.fn()
    mockCustomerDbGetCustomerById = jest.fn()
    mockCartDbSaveCart = jest.fn()
    mockCartDnReturnAllCartsAvailable = jest.fn()
    createNewCart = jest.fn().mockReturnValue(cart)

    //addProductsToCart
    mockProductDbGetOrSaveProductByByName = jest.fn()
    mockProductDbGetProductByName = jest.fn()
    mockCartContainsProductGetCartByCartIdAndProductName = jest.fn()
    mockCartContainsProductAddOrUpdateProduct = jest.fn()
    addProductsToCart = jest.fn().mockReturnValue(expect.any(Cart))

})

afterEach(()=>{
    jest.clearAllMocks()
})

test('given: customer exist but has no cart, when: creating a new cart, then: new cart is created fro customer', async ()=>{
    //given
    cartDb.getCartByCustomerId = mockCartDbGetCartByCustomerId.mockReturnValue(null)
    cartDb.returnAllCartsAvailable = mockCartDnReturnAllCartsAvailable.mockReturnValue([cart])
    cartDb.saveCart = mockCartDbSaveCart.mockReturnValue(cart[1])
    customerDb.getCustomerById = mockCustomerDbGetCustomerById.mockReturnValue(customer2)
    //when
    const createCart = await cartService.createNewCart(id)
    //then 
    expect(mockCartDbGetCartByCustomerId).toHaveBeenCalledWith(customer2.getId())
    expect(mockCartDnReturnAllCartsAvailable).toHaveBeenCalled()
    expect(mockCartDbSaveCart).toHaveBeenCalledWith(expect.any(Cart))
    expect(mockCustomerDbGetCustomerById).toHaveBeenCalledWith(id)
    expect(createCart).toEqual(cart[1])
})
test("given: customer exists and has cart, when: creating new cart, then: error is thrown", async()=>{
    //given
    cartDb.getCartByCustomerId = mockCartDbGetCartByCustomerId.mockReturnValue(cart[0])
    cartDb.saveCart = mockCartDbSaveCart.mockReturnValue(cart[0])
    customerDb.getCustomerById = mockCustomerDbGetCustomerById.mockReturnValue(customer1)
    //when
    await expect(cartService.createNewCart(customer1.getId())).rejects.toThrow("Customer has a cart.")//Q& When testing asynchronous functions that return promises, you need to handle the promise rejection. The rejects property in Jest is used to handle this scenario.
    //then
    expect(mockCartDbGetCartByCustomerId).toHaveBeenCalledWith(customer1.getId())
    expect(mockCartDbSaveCart).not.toHaveBeenCalled()
    expect(mockCustomerDbGetCustomerById).toHaveBeenCalledWith(customer1.getId())
})
test ("given: customer does not exist, when: creating new cart, then: error is thrown",async()=>{
    //given
    customerDb.getCustomerById = mockCustomerDbGetCustomerById.mockReturnValue(null)
    //when
    await expect(cartService.createNewCart(idOfNonExistenceCustomer)).rejects.toThrow(`No customer found with id ${idOfNonExistenceCustomer}`)
    //then
    expect(mockCustomerDbGetCustomerById).toHaveBeenCalledWith(idOfNonExistenceCustomer)

})
test ("given: product is already in cart, when: adding products to cart, then: products quantity is incremented",async()=>{
    //given
    cartDb.getCartByCustomerId = mockCartDbGetCartByCustomerId.mockReturnValue(cart[0])
    productDb.getProductByName = mockProductDbGetProductByName.mockReturnValue(products[0])
    cartContainsProductDb.getCartByCartIdAndProductName = mockCartContainsProductGetCartByCartIdAndProductName.mockReturnValue(cartContainsProduct[0])

    //when
    const addtocart = await cartService.addProductToCart(customer1,products[0])
    //then
    expect(mockCartContainsProductGetCartByCartIdAndProductName).toHaveBeenCalledWith(cart[0].getId(),products[0].getName())
    expect(mockCartDbGetCartByCustomerId).toHaveBeenCalledWith(customer1.getId())
    expect(mockProductDbGetProductByName).toHaveBeenCalledWith(products[0].getName())
    expect(addtocart).toEqual(cart[0])

})
test("given: product is not in cart, when: adding product to card, then: product is added to card",async()=>{
    // Given
    cartDb.getCartByCustomerId = mockCartDbGetCartByCustomerId.mockReturnValue(cart[0]);
    productDb.getProductByName = mockProductDbGetProductByName.mockReturnValue(products[2]);
    cartContainsProductDb.getCartByCartIdAndProductName = mockCartContainsProductGetCartByCartIdAndProductName.mockReturnValue(null); // Product not in cart
    cartContainsProductDb.addOrUpdateProduct = mockCartContainsProductAddOrUpdateProduct.mockReturnValue(new CartContainsProduct({cartId:cart[0].getId(),productName:products[2].getName(),quantity:1}));

    // When
    const addToCart = await cartService.addProductToCart(customer1, products[2])
    // Then
    expect(mockCartDbGetCartByCustomerId).toHaveBeenCalledWith(customer1.getId());
    expect(mockProductDbGetProductByName).toHaveBeenCalledWith(products[2].getName());
    expect(mockCartContainsProductGetCartByCartIdAndProductName).toHaveBeenCalledWith(cart[0].getId(), products[2].getName());
     expect(mockCartContainsProductAddOrUpdateProduct).toHaveBeenCalledWith(expect.objectContaining({cartId:cart[0].getId(),productName:products[2].getName(),quantity:1}));
     expect(addToCart).toEqual(cart[0])
});
