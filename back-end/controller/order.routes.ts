/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      order:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            description: order id 
 *          cartId:
 *            type: string
 *            description: unique identifier for each cart
 *          date:
 *            type: Date
 *            description: when an order was made
 *          customerId:
 *            type: string
 *            description: id of the customer making the order
 */



import express, { NextFunction, Request, Response } from 'express';
import orderService from '../service/order.service';
import { Order } from '../model/order';

const ordersRoutes = express.Router();


/**
 * @swagger
 * /orders/{customerId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: make an order using customer's id
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: customer's id
 *         example: 01c87cd2-e69f-4371-9a4f-b53faaf75ac4
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
 

ordersRoutes.post('/:customerId', async (req:Request, res:Response, next:NextFunction) => {

    try {
        const customerId: string  = req.params.customerId

        const result : {order : Order , message : string} | null = await orderService.createAnOrder(customerId)
        return res.status(200).json(result)
    
    }
    catch(error){
        next(error)
    }
})

export {ordersRoutes}