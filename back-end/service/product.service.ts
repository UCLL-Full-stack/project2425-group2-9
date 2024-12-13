import { Product } from "../model/product";
import multer from "multer";
import productDb from "../repository/product.db";
import { ProductInput } from "../types";

const getAllProducts = async (): Promise<Product[] | undefined> => {
    return await productDb.getAllProducts();
}

const getProductByName = async (name: string): Promise<Product> => {
    
    try {
        const product: Product | null = await productDb.getProductByName(name);
    if (!product) throw new Error(`Product "${name}" does not exist.`);
    return product;
}
catch (error){
    console.log(error)
    throw new Error("Database error. See server log for details.")
}
    }


export default {
    getAllProducts,
    getProductByName
};