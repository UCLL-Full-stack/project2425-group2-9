const getAllProducts = async () => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/products",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};
const getProductByName = async(name:string|undefined)=>{
    return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${name}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}
const ProductService = {
    getAllProducts,
    getProductByName
};

export default ProductService;