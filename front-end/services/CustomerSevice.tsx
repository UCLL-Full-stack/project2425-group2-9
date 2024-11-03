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

const clearCart = async (customerId: number) => {
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

const CustomerService = {
    clearCart
}

export default CustomerService;