import { Product } from "../model/product";
import multer from "multer";
import productDb from "../repository/product.db";
import { ProductInput } from "../types";

const getAllProducts = async (): Promise<Product[] | undefined> => {
    try {

        const products = await productDb.getAllProducts();

        // if (!products || (Array.isArray(products) && products.length === 0))
        //     throw new Error('No products found.')

        return products
    }

    catch(error) {
        throw new Error('No products found.')
    }
}

const getProductByName = async (name: string): Promise<Product> => {
    
    try {
        const product: Product | null = await productDb.getProductByName(name);
    if (!product) throw new Error(`Product "${name}" does not exist.`);
    return product;
}
catch (error){
    console.log(error)
    throw new Error(`Product "${name}" does not exist.`)
}
    }


export default {
    getAllProducts,
    getProductByName
};