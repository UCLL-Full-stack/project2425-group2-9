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
import { CartContainsProduct } from '../model/cartContainsProduct';//not suppose to be here according to layered achitecture
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
 *                              type: string
 *                              example: 01c87cd2-e69f-4371-9a4f-b53faaf75ac4
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
// cartRouter.post("/create", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { customerId } = req.body
//         if (!customerId) {
//             return res.status(400).json({ message: 'customerId is needed' })//Q& am not really sure of this because we wont expect our customer to manually fill in their ID
//         }
//         const createCart = await cartService.createNewCart(customerId)
//         if (!createCart) {
//             return res.status(404).json({ message: 'sorry... cart could not be created, try again' })
//         }
//         return res.status(201).json({ message: 'cart created successfully' })
//     } catch (e) {
//         const error = (e as Error)
//         res.status(400).json({ status: "error", message: error.message })
//     }

// })

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
 *                          customerId:
 *                              type: string
 *                              description: customer's id
 *                              example: "59f95af7-1dd7-4b4e-8f1a-03b5886ac9f9"
 *                          productName:        
 *                              type: string
 *                              description: name of product
 *                              example : phone       
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
 *         
 */
cartRouter.post('/addtocart', async (req: Request, res: Response, next: NextFunction) => {


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
 *              type: string
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
        const cartId: string = (req.params.cartId);
         const cart: CartContainsProduct[] | null = await cartService.getCartContainsProductByCartId(cartId);
        //  const cart: Product[] | null = await cartService.returnAllProductsInCart(cartId);
        if (!cart)
            res.status(404).json({ message: `Cart with id ${cartId} not found.` });
        res.status(202).json(cart);
    } catch (e) {
        next(e);
    }

String
})



/** 
 * @swagger
 *  /carts/addtocart:
 *  put:
 *      summary: increase product quantity bt one
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          cartId:
 *                              type: string
 *                              description: cart id
 *                              example: 153e614f-8511-4491-9a5a-fd8511626b87
 *                          productName:        
 *                              type: string
 *                              description: name of product
 *                              example : phone       
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
*/

cartRouter.put('/:cartId', async (req : Request, res : Response, next : NextFunction) => {
   
    try {
        const addToCartBody = <AddToCartInput>req.body;
        const result = cartService.addProductToCart(addToCartBody);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }

})
export { cartRouter }