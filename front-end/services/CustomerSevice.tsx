// const addCartItem = async ({ cartId, productName }: CartItem ) => {
//     return await fetch(
//         process.env.NEXT_PUBLIC_API_URL + "/carts/addtocart",
//         {
//             method: "POST",
//             body: JSON.stringify({
//                     "cartId": cartId,
//                     "productName": productName
//             }),
//             headers: {
//                 'Content-Type': 'application/json',
//                 Accept: 'application/json'
//             }
//         }
//     );
// };

import { CartItem, Role, CustomerInput } from "@/types";

const clearCart = async (customerId: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerId}/cart`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};

const addCartItem = async (customerId: string, productName: string) => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${customerId}/cart/${productName}`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
};


const fetchCartItemsByCustomerId = async(id: number) => {
    return fetch(
        process.env.NEXT_PUBLIC_API_URL + `/customers/${id}/cart`,
        {
            method:"GET",
            headers:{
                "content-type":"application/json"
            }
        }
    );
}

const register = async ( { password, firstName, lastName, username, phone, role }: CustomerInput  ) => {

    return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/signup`,
        {
            method:"POST",
            body: JSON.stringify({
                password,
                lastName,
                firstName,
                role,
                phone,
                username
              }),
            headers:{
                "content-type":"application/json"
            }
})
}

const  login = async ( { username, password} : CustomerInput )  => {

    return await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/customers/login`,
         {
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify({
                username,
                password,
            }),
         }
    )
}
const CustomerService = {
    clearCart,
    addCartItem,
    fetchCartItemsByCustomerId,
    register,
    login
}

export default CustomerService;