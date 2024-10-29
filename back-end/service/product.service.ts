import { Product } from "../model/product";
import productDb from "../repository/product.db";

const getAllProducts = (): Product[] => {
    return productDb.getAllProducts();
}

const getProductByName = (name: string): Product => {
    const product: Product | null = productDb.getProductByName(name);
    if (!product) throw new Error(`Product "${name}" does not exist.`);
    return product;
}

export default {
    getAllProducts,
    getProductByName
};