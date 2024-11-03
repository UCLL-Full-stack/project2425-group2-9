/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      cart:
 *      type: object
 *      properties:
 *        cartId:
 *          type: number
 *          description: unique identifier for each cart
 *        totalPrice:
 *          type: number
 *          description: total price of all products in the cart
 *        customerId:
 *          type: number
 *          description: unique identifier that tells which cart belongs to which customer
 * 
 */

import express, { NextFunction, Request, response, Response } from 'express';
import { Customer } from '../model/customer'; // Add this line to import the Customer class
import cartService from '../service/cart.service';
import { Product } from '../model/product';
import { Cart } from '../model/cart';
import { CartContainsProduct } from '../model/cartContainsProduct';
import { AddToCartInput } from '../types';

const cartRouter = express.Router();

/**
 * @swagger
 * /carts/create:
 *  post:
 *      summary: Create a new cart
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          customerId:
 *                              type: number
 *                              example: 2
 *      responses:
 *          201:
 *              description: Cart created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/cart'
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: customerId is needed
 *          404:
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: sorry... cart could not be created, try again
 */

// URL: /carts/create
cartRouter.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId } = req.body
        if (!customerId) {
            return res.status(400).json({ message: 'customerId is needed' })//Q& am not really sure of this because we wont expect our customer to manually fill in their ID
        }
        const createCart = await cartService.createNewCart(customerId)
        if (!createCart) {
            return res.status(404).json({ message: 'sorry... cart could not be created, try again' })
        }
        return res.status(201).json({ message: 'cart created successfully' })
    } catch (e) {
        const error = (e as Error)
        res.status(400).json({ status: "error", message: error.message })
    }

})

/**
 * @swagger
 * /carts/addtocart:
 *  post:
 *      summary: Add a product to a cart
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          customer:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                      example: 2
 *                                  password:
 *                                      type: string
 *                                      example: "password123"
 *                                  securityQuestion:
 *                                      type: string
 *                                      example: "What is your pet's name?"
 *                                  userName:
 *                                      type: string
 *                                      example: "john_doe"
 *                                  firstName:
 *                                      type: string
 *                                      example: "John"
 *                                  lastName:
 *                                      type: string
 *                                      example: "Doe"
 *                                  phone:
 *                                      type: number
 *                                      example: 1234567890
 *                          product:
 *                              type: object
 *                              properties:
 *                                  name:
 *                                      type: string
 *                                      example: "phone"
 *                                  price:
 *                                      type: number
 *                                      example: 100
 *                                  unit:
 *                                      type: string
 *                                      example: "grams"
 *                                  stock:
 *                                      type: number
 *                                      example: 40
 *                                  description:
 *                                      type: string
 *                                      example: "samsung 22 ultra"
 *                                  imagePath:
 *                                      type: string
 *                                      example: "../image/phone.png"                            
 *      responses:
 *          201:
 *              description: Product added to cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "Product added to cart successfully"
 *          400:
 *              description: Bad Request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "Missing required fields"
 *          404:
 *              description: Not Found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "Cart or product not found"
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: "An error occurred"
 */
cartRouter.post('/addtocart', async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const { customer, product } = req.body
    //     if (!customer || !product) //Q& if any field is missing
    //         return res.status(404).json({ message: "no customer or product found" })

    //     const { id, password, securityQuestion, userName, firstName, lastName, phone } = customer
    //     if (!id || !password || !securityQuestion || !userName || !firstName || !lastName || !phone)

    //         return res.status(400).json({ message: "customers fields are required" })

    //     const { name, price, unit, stock, description, imagePath } = product
    //     if (!name || !price || !stock || !description || !imagePath)
    //         return res.status(404).json({ message: "product field id required" })

    //     const addProductOrUpdate = cartService.addProductToCart(customer, product)
    //     if (!addProductOrUpdate)
    //         return res.status(401).json({ message: "sorry... products was not updated/added" })

    //     return res.status(201).json({ message: "products added successfully" })
    // } catch (error) {
    //     next(error)
    // }


    try {
        const addToCartBody = <AddToCartInput>req.body;
        const result = cartService.addProductToCart(addToCartBody);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /carts/{cartId}:
 *   get:
 *     summary: Get a cart with all its products.
 *     parameters:
 *          - in: path
 *            name: cartId
 *            schema:
 *              type: number
 *              required: true
 *              description: The Id of the card.
 *              example: 1
 *     responses:
 *       200:
 *         description: A product object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

cartRouter.get("/:cartId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cartId: number = Number(req.params.cartId);
        const cart: CartContainsProduct[] | null = await cartService.getCartContainsProductByCartId(cartId);
        // const cart: Product[] | null = await cartService.returnAllProductsInCart(cartId);
        if (!cart)
            res.status(404).json({ message: `Cart with id ${cartId} not found.` });
        res.status(202).json(cart);
    } catch (e) {
        next(e);
    }


})

export { cartRouter }