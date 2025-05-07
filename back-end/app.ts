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
import helmet from 'helmet';
import * as fs from 'fs';
import * as path from 'path';
import logger from './util/logger';

const publicKey = fs.readFileSync(path.resolve(process.cwd(), process.env.JWT_PUBLIC_KEY || './keys/public.key'), 'utf8');
const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.use(helmet.contentSecurityPolicy({
    directives : {
        connectSrc :  ["self" , "https://api.ucll.be"],
        objectSrc: ["'none'"], upgradeInsecureRequests: [],
        scriptSrc: ["self"]
    }
}))

app.use(helmet.frameguard()); // Prevent clickjacking
app.use(helmet.xssFilter()); // Prevent XSS attacks
app.use(helmet.noSniff()); // Prevent MIME type sniffing
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable CSP
        xDownloadOptions: false, // Disable X-Download-Options
    })
);

app.use(
    helmet.hsts({
      // 60 days
      maxAge: 86400,
      // removing the "includeSubDomains" option
      includeSubDomains: false,
    })
   )
   // setting "Referrer-Policy" to "no-referrer"
app.use(
    helmet.referrerPolicy({
      policy: "no-referrer",
    })
  )
//add express-jwt middleware function here
app.use(
    expressjwt({
        secret: publicKey,
        algorithms: ['RS256'],
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



app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        logger.error(`UnauthorizedError: ${err.message}`);
        res.status(401).json({ status: 'unauthorized', message: 'Invalid or missing token.' });
    } else if (err.name === 'ApplicationError') {
        logger.error(`ApplicationError: ${err.message}`);
        res.status(400).json({ status: 'domain error', message: err.message });
    } else if (err.name === 'ValidationError') {
        logger.error(`ValidationError: ${err.message}`);
        res.status(422).json({ status: 'validation error', message: err.message });
    } else {
        logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });
        res.status(500).json({ status: 'error', message: 'An unexpected error occurred. Please try again later.' });
    }
});
app.listen(port || 3000, () => {
    console.log(`Back-end is running on port ${port}.`);
});
