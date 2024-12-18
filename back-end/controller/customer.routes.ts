import express, { NextFunction, Request, Response } from 'express';
import customerService from '../service/customer.service';
import { Role } from '@prisma/client';
import { AuthenticatedRequest, CustomerInput, UploadAuth } from '../types';
import multer from 'multer';
import { uploadOptions } from '../util/middleware';
import authMiddleware from '../middleware/authMiddleware';

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
customerRouter.delete('/:id/cart/:productName', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId: string = String(req.params.id);
        const productName: string = String(req.params.productName);
        const result: string = await customerService.deleteCartItem({ customerId, productName });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/{id}/cart:
 *   delete:
 *     security:
 *       - bearerAuth: []
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
customerRouter.delete('/:id/cart', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId: string = String(req.params.id);
        const result: string = await customerService.deleteAllCartItems(customerId);
        res.status(200).json(result);
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
 *               role:
 *                 type: Role
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *             example:
 *               password: roland123
 *               lastName: sone
 *               firstName: roland
 *               role : admin
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
customerRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = <CustomerInput>req.body;
        const createCustomer = await customerService.registerCustomer(customer);
        res.status(200).json(createCustomer);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers/login:
 *   post:
 *     summary: Authenticate a customer and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               password: roland123
 *               username: roland_12
 *     responses:
 *       200:
 *         description: Authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResponse'
 */
customerRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput: CustomerInput = req.body;
        const response = await customerService.authenticate(userInput);
        return res.status(200).json({ message: 'Authentication successful', ...response });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all customers
 *     responses:
 *       200:
 *         description: A list of customers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Customer'
 */
customerRouter.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as unknown as AuthenticatedRequest;
    try {
        const { username, role } = authReq.auth;
        const customers = await customerService.getAllCustomers({ username, role: role as Role });
        return res.status(200).json(customers);
    } catch (error) {
        next(error);
    }
});


 
 

export { customerRouter };
