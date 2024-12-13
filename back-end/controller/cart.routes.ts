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
import { AddToCartInput, CartDetails } from '../types';

const cartRouter = express.Router();



/**
 * @swagger
 * /carts/addtocart:
 *  post:
 *      security:
 *       - bearerAuth: []
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
 */
cartRouter.post('/addtocart', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addToCartBody = <AddToCartInput>req.body;
        const result = await cartService.addProductToCart(addToCartBody);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /carts/{cartId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a cart with all its products.
 *     parameters:
 *       - in: path
 *         name: cartId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Id of the cart.
 *         example: "2e937a99-6713-4237-86b9-817b2939fbe6"
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
         const cart: CartDetails[] |null  = await cartService.getCartDetails({ cartId });
        //  const cart: Product[] | null = await cartService.returnAllProductsInCart(cartId);
        return res.status(202).json(cart);
    } catch (e) {
        next(e);
    }
String
})



/** 
 * @swagger
 *  /carts/addtocart:
 *  put:
 *      security:
 *       - bearerAuth: []
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