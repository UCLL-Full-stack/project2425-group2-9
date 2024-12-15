import * as dotenv from 'dotenv';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { productRouter } from './controller/product.routes';
import express, { Request, Response, NextFunction } from 'express';
import { customerRouter } from './controller/customer.routes';
import { cartRouter } from './controller/cart.routes';
import { ordersRoutes } from './controller/order.routes';
import { expressjwt } from 'express-jwt';
const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

//add express-jwt middleware function here
app.use(
    expressjwt({
        secret: process.env.JWT_SECRET || 'default_secret',
        algorithms: ['HS256'],
        requestProperty: 'customer'
    }).unless({
        path: [
            '/api-docs',
            /^\/api-docs\/.*/,
            '/customers/login',
            '/customers/signup',
            '/status',
            '/products'
        ],
    })
);

// add authorization middleware function here

app.use('/products', productRouter);
app.use('/customers', customerRouter);
app.use('/orders', ordersRoutes);
// app.use('/carts/create',cartRouter)
app.use('/carts', cartRouter)


app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});


const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Veso API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//generically handles all applications correctly => no need to explicitly write this in each controller
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(400).json({ status: 'unauthorized', message: err.message });
    } else if (err.name === 'ApplicationError') {
        res.status(400).json({ status: 'domain error', message: err.message });
    } else {
        res.status(400).json({ status: 'application error', message: err.message });
    }
});


app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
