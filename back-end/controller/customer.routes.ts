import express, { NextFunction, Request, Response } from 'express';
import customerService from '../service/customer.service';

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
 *              example: 1
 *          - in: path
 *            name: productName
 *            schema:
 *              type: string
 *              required: true
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
        const customerId: number = Number(req.params.id);
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
 *              example: 1
 *     responses:
 *       200:
 *         description: Message indicating success.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
customerRouter.delete('/:id/cart', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId: number = Number(req.params.id);
        const result: string = await customerService.deleteAllCartItems(customerId);
        res.json(result);
        // res.status(200).json(result);   // DOES NOT WORK!!!!!!!! Q&
    } catch (error) {
        next(error);
    }
});


export { customerRouter };
