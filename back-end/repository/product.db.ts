import { Product } from "../model/product";
import database from "../util/database";

// Q& Is it an issue if the descriptions are somehow unappropriated?
//i dont think it matters if they are but we should make them descriptive enough


const getAllProducts = async (): Promise<Product[] | undefined> => {
    
    try {

        const productPrisma = await database.product.findMany({
            include : {
                cart : false
            }
        })

        if (!productPrisma) 
            throw new Error("no products found")
        return productPrisma.map((productPrisma) => Product.from(productPrisma))
    }
    catch(error){
        console.log(error)
    }
}
const addNewProduct = async (newProduct:Product) : Promise<string | null > =>{
    
    try {

        const createNewProduct = await database.product.create({
            data: {
                name : newProduct.getName(),
                price : newProduct.getPrice(),
                unit : newProduct.getUnit(),
                stock : newProduct.getStock(),
                description : newProduct.getDescription(),
                imagePath : newProduct.getImagePath()
            }
        })

        if (!createNewProduct)
            throw new Error("product was not added to the database. please try again.")
        return "product added successfully"
    }
    catch (error) {
        console.log(error)
        throw new Error("Database error. See server log for details.")
    }
}
const getProductByName = async (name: string): Promise<Product | null> => {

    try {

        const productPrisma = await database.product.findFirst({
            where : {
                name : name
            },
            include : {cart : false}
        })

        if (!productPrisma)
            throw new Error("product not found")
        return Product.from(productPrisma)
    }
   catch (error) {
    console.log(error)
    throw new Error("Database error. See server log for details.")
   }
}
// const getOrSaveProductByName = (name: string, newProduct: Product): Product => {
//     let product = getProductByName(name);
//     if (!product) {
//         product = saveNewProduct(newProduct);
//         if (!product) {
//             throw new Error("Failed to save new product");
//         }
//     }
//     return product;
// }
const deleteProductByName = async (name: string): Promise <string> => {
    
    try {

        const deleteProduct = await database.product.delete({
            where : {
                name : name
            }
        })

        if (!deleteProduct)
            throw new Error("no product found ")
        return "product deleted successfully"
    }
    catch (error) {
        throw new Error("Database error. See server log for details.")
    }
    
}

export default {
    getAllProducts,
    getProductByName,
    addNewProduct,
    deleteProductByName,
    // getOrSaveProductByName
};