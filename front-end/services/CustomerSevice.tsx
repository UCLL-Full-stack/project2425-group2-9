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


const incrementQuantity = async ({customerId, productName} : {customerId: string, productName: string}) => {

    const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
    const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}/cart/${productName}/increment`,
        {
            method : "PUT",
            body : JSON.stringify({
                customerId,
                productName
            }),
            headers:{
                "content-type":"application/json",
                Authorization: `Bearer ${token}`
            },

        }
     );

     if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "failed to increase item quantity");
     } 
    return response;

}

const decrementQuantity = async ({customerId, productName} : {customerId: string, productName: string}) => {

    const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
    const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}/cart/${productName}/decrement`,
        {
            method : "PUT",
            body : JSON.stringify({
                customerId,
                productName
            }),
            headers:{
                "content-type":"application/json",
                Authorization: `Bearer ${token}`
            },

        }
     );

     if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "failed to decrement item quantity");
     } 
    return response;

}

const register = async ( { password, firstName, lastName, username, phone, role }: CustomerInput  ) => {
    const response = await fetch(
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
                "content-type":"application/json",
                
            }
        }
    );

    
    if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "Login failed");
     } 
    return response;
}

const login = async ( { username, password} : CustomerInput )  => {
    const response = await fetch(
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
    );

    if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "Login failed");
     } 
    return response;
}

const fetchCustomers = async () => {
    const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
    const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
    }

    return await response.json();
};

const deleteSingleItem = async ({customerId, productName} : {customerId : string, productName: string}) => {

    const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
    const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}/cart/${productName}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                // "Accept": 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ customerId, productName })
        }
    );

    if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "failed to delete item");
     } 
     return await response.json();
}


const placeAnOrder = async (customerId : string) => {
    const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
    const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${customerId}`,
        {
           method:"POST",
           headers:{
               "content-type":"application/json",
               Authorization: `Bearer ${token}`
           },
           body: JSON.stringify({
               customerId
           }),
        }
   );

   if (!response.ok) {
       const errorData = await response.json(); 
       throw new Error(errorData.message || "order failed.");
    } 
   return response;
}



const CustomerService = {
    clearCart,
    addCartItem,
    register,
    login,
    fetchCustomers,
    decrementQuantity,
    incrementQuantity,
    deleteSingleItem,
    placeAnOrder
    
};

export default CustomerService;