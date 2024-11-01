const fetchCartById = async(id: number) =>{
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`,
        {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }   )
}

const ProductService = {
    fetchAllCarts: fetchCartById
}

export default ProductService