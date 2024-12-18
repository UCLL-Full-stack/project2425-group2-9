
// const returnAllProductsInCart = async (cartId: string): Promise<CartDetails | null> => {
//     try {
//         if (!cartId) throw new Error("Cart ID is required.");

import { UnauthorizedError } from "express-jwt"
import productDb from "../repository/product.db"
import { Product } from "../model/product"
import { ProductInput } from "../types"

//         // Log the cartId to ensure it's being passed correctly
//         console.log("Fetching products for cart ID:", cartId);

//         const fetchCartItemNamesByCartId = await cartContainsProductDb.getCartItemNamesByCartId(cartId);
//         if (!fetchCartItemNamesByCartId || fetchCartItemNamesByCartId.length === 0) {
//             throw new Error("Your cart is empty, please add products to it.");
//         }

//         // Log the fetched product names
//         console.log("Fetched product names:", fetchCartItemNamesByCartId);

//         const totalPrice = await calculateTotalPrice({ cartId });
//         const products: Product[] = await Promise.all(fetchCartItemNamesByCartId.map(async (productName: string) => {
//             const product = await productDb.getProductByName(productName);
//             if (!product) throw new Error(`Product with name ${productName} not found`);
//             return product;
//         }));

//         // Log the fetched products and total price
//         console.log("Fetched products:", products);
//         console.log("Total price:", totalPrice);

//         // return { product: products, totalPrice };
//     } catch (error) {
//         console.error("Error in returnAllProductsInCart:", error);
//         return null;
//     }
// };

const uploadNewProduct = async ( { name ,price, unit ,stock , description ,imagePath} : ProductInput) : Promise<Product | null> => {

    try {
         if (

            !name || 
            !unit || 
            !price ||
            !stock || 
            !description || 
            !imagePath
        
        )
             
            throw new Error("all fields required")

         const newProduct =  new Product({
             
             name ,
             price ,
             unit ,
             stock ,
             description,
             imagePath 
 
         })
 
        //  if (role !== "ADMIN")
        //     throw new UnauthorizedError('credentials_required', {
        //         message : 'you are not authorized to access the resource'
        //     })
         return await productDb.addNewProduct(newProduct)
     
    }
    catch(error){
        console.error(error)
        throw new UnauthorizedError('credentials_required', {
            message : 'you are not authorized to access the resource'
        })
    }
 }

//  * @swagger
//  * /customers:
//  *   post:
//  *     summary: Upload a new product
//  *     security:
//  *       - bearerAuth: []
//  *     tags:
//  *       - Products
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               price:
//  *                 type: number
//  *               unit:
//  *                 type: string
//  *               stock:
//  *                 type: number
//  *               description:
//  *                 type: string
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       201:
//  *         description: Product created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 name:
//  *                   type: string
//  *                 price:
//  *                   type: number
//  *                 unit:
//  *                   type: string
//  *                 stock:
//  *                   type: number
//  *                 description:
//  *                   type: string
//  *                 imagePath:
//  *                   type: string
//  *       400:
//  *         description: Bad request
//  *       403:
//  *         description: Access denied
//  */
// customerRouter.post('/', uploadOptions.single('image'), authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { name, price, unit, stock, description } = req.body;

//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded.' });
//         }
//         const imageUrl = `${req.protocol}://${req.get('host')}/resources/images/${req.file.filename}`;
//         const newProduct = await customerService.uploadNewProduct({
//             name,
//             price: parseFloat(price),
//             unit,
//             stock: parseInt(stock, 10),
//             description,
//             imagePath: imageUrl
//         });

//         res.status(201).json(newProduct);
//     } catch (error) {
//         next(error);
//     }
// });