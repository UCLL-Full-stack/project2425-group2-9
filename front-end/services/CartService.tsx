import exp from "constants"

const fetchAllCarts = async(cartId:number) =>{
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${cartId}`,
        {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }   )
}

const ProductService = {
    fetchAllCarts
}

export default ProductService