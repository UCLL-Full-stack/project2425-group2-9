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
import cartService from '../service/cart.service';
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
 * /carts/{customerId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a cart with all its products.
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The Id of the customer.
 *         example: ed1e65bb-8f89-4d01-86bc-21b25f084b0a
 *     responses:
 *       200:
 *         description: A product object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
cartRouter.get("/:customerId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId: string = String(req.params.customerId);
         const cart: CartDetails[]  = await cartService.getCartDetails({customerId});
        //  const cart: Product[] | null = await cartService.returnAllProductsInCart(cartId);
        if (!cart)
            res.status(404).json({ message: `Cart with id ${customerId} not found.` });
        res.status(202).json(cart);
    } catch (e) {
        next(e);
    }
})


export { cartRouter }