
import { AddprodutToCar, CartDetails } from "@/types";


const addProductToCart = async ({customerId, productName} :AddprodutToCar) => {
    const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
    const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carts/addtocart`,
        {
            method:"POST",
            body: JSON.stringify({
               
                customerId,
                productName
              }),
            headers:{
                "content-type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    
    if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "product was not added to cart.");
     } 
    return response;
}

export const fetchCartDetailsByCustomerId = async ({customerId} : {customerId: string}): Promise<CartDetails[]> => {

    const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
    const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${customerId}`,
        {
            method : "GET",
            headers:{
                "content-type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );
    if (!response.ok) {
        throw new Error(`Error fetching cart details: ${response.statusText}`);
    }
    const cartDetails: CartDetails[] = await response.json();
    return cartDetails;
};






const CartService = {
    addProductToCart, 
    fetchCartDetailsByCustomerId,
  
}
export default CartService

