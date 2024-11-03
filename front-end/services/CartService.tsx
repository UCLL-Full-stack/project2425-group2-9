import { CartItem } from "@/types";

const fetchCartItemsByCartId = async(id: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts/${id}`,
        {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }
    );
}

const addCartItem = async ({ cartId, productName }: CartItem ) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/carts/addtocart",
        {
            method: "POST",
            body: JSON.stringify({
                    "cartId": cartId,
                    "productName": productName
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};

const CartService = {
    fetchCartItemsByCartId,
    addCartItem
}

export default CartService;