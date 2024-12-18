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

const getProductByName = async (name: string) => {
    //ensure session storage is only dine
    if (typeof window !== 'undefined') {
        const loggedInCustomer = sessionStorage.getItem("loggedInCustomer");
        const token = loggedInCustomer ? JSON.parse(loggedInCustomer).token : null;
        return await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${name}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } else {
        throw new Error("sessionStorage is not available on the server side.");
    }
};

const ProductService = {
    getAllProducts,
    getProductByName
};

export default ProductService;