
// const returnAllProductsInCart = async (cartId: string): Promise<CartDetails | null> => {
//     try {
//         if (!cartId) throw new Error("Cart ID is required.");

//         // Log the cartId to ensure it's being passed correctly
//         console.log("Fetching products for cart ID:", cartId);

//         const fetchCartItemNamesByCartId = await cartContainsProductDb.getCartItemNamesByCartId(cartId);
//         if (!fetchCartItemNamesByCartId || fetchCartItemNamesByCartId.length === 0) {
//             throw new Error("Your cart is empty, please add products to it.");
//         }

//         // Log the fetched product names
//         console.log("Fetched product names:", fetchCartItemNamesByCartId);

//         const totalPrice = await calculateTotalPrice({ cartId });
//         const products: Product[] = await Promise.all(fetchCartItemNamesByCartId.map(async (productName: string) => {
//             const product = await productDb.getProductByName(productName);
//             if (!product) throw new Error(`Product with name ${productName} not found`);
//             return product;
//         }));

//         // Log the fetched products and total price
//         console.log("Fetched products:", products);
//         console.log("Total price:", totalPrice);

//         // return { product: products, totalPrice };
//     } catch (error) {
//         console.error("Error in returnAllProductsInCart:", error);
//         return null;
//     }
// };