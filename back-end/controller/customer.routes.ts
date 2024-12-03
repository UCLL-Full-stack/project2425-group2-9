import express, { NextFunction, Request, Response } from 'express';
import customerService from '../service/customer.service';
import { Customer } from '@prisma/client';
import { CustomerInput } from '../types';

const customerRouter = express.Router();

/**
 * @swagger
 * /customers/{id}/cart/{productName}:
 *   delete:
 *     summary: Delete an item (product) from a cart using customer ID and product name.
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              required: true
 *              description: Customer's ID.
 *              example: "01c87cd2-e69f-4371-9a4f-b53faaf75ac4"
 *          - in: path
 *            name: productName
 *            schema:
 *              type: string
 *              description: Product's name.
 *              example: Bread
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
customerRouter.delete('/:id/cart/:productName', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId: string = String(req.params.id);
        const productName: string = String(req.params.productName);
        const result: string = await customerService.deleteCartItem({ customerId, productName });
        res.json(result);
        // res.status(200).json(result);   // DOES NOT WORK!!!!!!!! Q&
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/{id}/cart:
 *   delete:
 *     summary: Delete all items (products) from a cart using customer ID.
 *     parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              required: true
 *              description: Customer's ID.
 *              example: 01c87cd2-e69f-4371-9a4f-b53faaf75ac4
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Cart items deleted successfully.
 */
customerRouter.delete('/:id/cart', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId: string = String(req.params.id);
        const result: string = await customerService.deleteAllCartItems(customerId);
        res.json(result);
        // res.status(200).json(result);   // DOES NOT WORK!!!!!!!! Q&
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/signup:
 *   post:
 *     summary: Create a new customer in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               securityQuestion:
 *                 type: string
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *             example:
 *               password: roland123
 *               lastName: sone
 *               firstName: roland
 *               securityQuestion: when were you born
 *               phone: 0466058946
 *               username: roland_12
 *     responses:
 *       200:
 *         description: Customer object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

customerRouter.post('/signup', async (req:Request, res: Response, next: NextFunction) => {

    try {

        const customer  = <CustomerInput>req.body
        const createCustomer = await customerService.registerCustomer(customer)
        res.status(200).json(createCustomer)
    }
    catch (error){
        next(error)
    }
})

export { customerRouter };
