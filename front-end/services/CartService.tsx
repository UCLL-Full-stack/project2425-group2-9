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

const updateOrAddCartItem = async () => {
    return await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/carts/addtocart",
        {
            method: "Post",
            body: JSON.stringify({
                    "customer": {
                      "id": 3, // DO NOT CHANGE THIS!
                      "password": "password123",
                      "securityQuestion": "What is your pet's name?",
                      "userName": "john_doe",
                      "firstName": "John",
                      "lastName": "Doe",
                      "phone": 1234567890
                    },
                    "product": {
                      "name": "Bananas",
                      "price": 5,
                      "unit": "bunch",
                      "stock": 22,
                      "description": "A banana is an elongated, edible fruit -- botanically a berry[1] -- produced by several kinds of large herbaceous flowering plants in the genus Musa. In some countries, cooking bananas are called plantains, distinguishing them from dessert bananas. The fruit is variable in size, color and firmness, but is usually elongated and curved, with soft flesh rich in, starch covered with a peel, which may have a variety of colors when ripe. It grows upward in clusters near the top of the plant. Almost all modern edible seedless (parthenocarp) cultivated bananas come from two wild species -- Musa acuminata and Musa balbisiana, or hybrids of them.",
                      "imagePath": "/images/bananas.png"
                    }
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
    updateOrAddCartItem
}

export default CartService;