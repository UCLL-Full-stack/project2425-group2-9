import { CartContainsProduct } from "../model/cartContainsProduct";
import database from "../util/database";

const getCartItemNamesByCartId = async (id: string): Promise<string[] | undefined> => {
    try {
        // Log the cart ID to ensure it's being passed correctly
        console.log("Fetching cart items for cart ID:", id);

        const cartContainsProductPrisma = await database.cartContainsProduct.findMany({
            where: {
                cartId: id
            },
            include: { cart: true, product: true }
        });
        if (!cartContainsProductPrisma || cartContainsProductPrisma.length === 0) {
            console.error("No products/carts found for cart ID:", id);
            return undefined;
        }

        const cartContainsProductOb = cartContainsProductPrisma.map(
            (cartContainsProductPrisma) =>
                CartContainsProduct.from({
                    ...cartContainsProductPrisma,
                    product: cartContainsProductPrisma.product ?? undefined
                })
        );

        const productNames = cartContainsProductOb.map((cartContainsProductOb) =>
            cartContainsProductOb.getProduct()?.getName()
        );

        // Log the fetched product names
        console.log("Fetched product names:", productNames);

        return productNames.filter((name): name is string => name !== undefined);
    } catch (error) {
        console.error("Error in getCartItemNamesByCartId:", error);
        throw new Error("Database error. See server log for details.");
    }
};

const getCartByCartIdAndProductName = async (cartId: string, productName: string): Promise<CartContainsProduct | null> => {
    try {
        const cartContainsProductPrisma = await database.cartContainsProduct.findFirst({
            where: {
                cartId,
                product: { name: productName }
            },
            include: { cart: true, product: true }
        });


        //you do not throw an error in the repository , if a record does not exist return null.
        //error are handled only in the service.
        // if (!cartContainsProductPrisma) throw new Error("No cart item found");
        if (!cartContainsProductPrisma) return null;

        return CartContainsProduct.from({
            ...cartContainsProductPrisma,
            cart: cartContainsProductPrisma.cart ?? undefined,
            product: cartContainsProductPrisma.product ?? undefined
        });
    } catch (error) {
        console.error(error);
        throw new Error("Database error:"+error);
    }
};

// Cart item is product in the cart.
const addCartItem = async (cartItem: CartContainsProduct): Promise<CartContainsProduct | null> => {
    try {
        const cartContainsProductPrisma = await database.cartContainsProduct.create({
            data: {
                cartId: cartItem.getCartId(),
                productName: cartItem.getProductName(),
                quantity: cartItem.getQuantity()
            }, 
            // include : {
            //     product : true
            // }
        });

        if (!cartContainsProductPrisma) return null

        return CartContainsProduct.from(
            cartContainsProductPrisma
            // product: cartContainsProductPrisma.product ?? undefined
        );
    } catch (error) {
        console.log(error);
        throw new Error("cart item was not created");
    }
};

// const getCartItemByCartId, returns a list of all items with the correct cart id.
const returnAllItemsInCart = async (uniqueCartId: string ): Promise<CartContainsProduct[] | null> => {
    try {
        const cartContainsProductPrisma = await database.cartContainsProduct.findMany({
            where: {
                cart : {
                    id: uniqueCartId
                }
            },
            include: { cart: true, product: true }
        });

        if (!cartContainsProductPrisma || cartContainsProductPrisma.length === 0)
            return null

        return cartContainsProductPrisma.map((cartContainsProductPrisma) =>
            CartContainsProduct.from({
                ...cartContainsProductPrisma,
                product: cartContainsProductPrisma.product ?? undefined
            })
        );
    } catch (error) {
        console.log(error);
        throw new Error('database error'+error)
    }
}; //now we have a list of carts that match a particular cart id

const deleteCartItemByCartIdAndProductName = async (
    cartId: string | undefined,
    name: string
): Promise<string | null> => {
    
    if (!cartId) return null

     if (!name) throw new Error("name is undefined");

    try {
        const cartContainsProductPrisma = await database.cartContainsProduct.delete({
            //always use the compound unique key carId_productName to delete an item from cart
            where: {
                cartId_productName: {
                    cartId: cartId,
                    productName: name
                }
            }
        });
        if (!cartContainsProductPrisma) return "items were not deleted";
        return "items deleted successfully";
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const decrementProductQuantity = async (cartId: string, name: string): Promise<string | null> => {
    if (!cartId) return null;

    try {
        const cartContainsProductPrisma = await database.cartContainsProduct.update({
            where: {
                cartId_productName: {
                    cartId: cartId,
                    productName: name
                }
            },
            data: {
                quantity: {
                    decrement: 1
                }
            }
        });

        if (!cartContainsProductPrisma) return "Quantity was not updated";
        return "Item quantity decremented by one.";
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};

const incrementProductQuantity = async (cartId: string, name: string): Promise<string | null> => {
    if (!cartId) return null;

    try {
        const cartContainsProductPrisma = await database.cartContainsProduct.update({
            where: {
                cartId_productName: {
                    cartId: cartId,
                    productName: name
                }
            },
            data: {
                quantity: {
                    increment: 1
                }
            }
        });

        if (!cartContainsProductPrisma) return "Quantity was not updated";
        return "Item quantity incremented by one.";
    } catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};


const deleteAllCartItems = async (cartId: string): Promise<string> => {
    try {
        const cartContainsProductPrisma = await database.cartContainsProduct.deleteMany({
            where: {
                cartId: cartId
            }
        });

        if (cartContainsProductPrisma.count === 0) return "no items to be deleted";
        return "items deleted successfully";
    } catch (error) {
        throw new Error("Database error. See server log for details.");
    }
};

const getProductsByNameInCart = async (
    cartId: string,
    productName: string
): Promise<CartContainsProduct[] | null> => {

    try {
        const returnAllItemsInCartResult = await returnAllItemsInCart(cartId);

        if (!returnAllItemsInCartResult) return null;

        return returnAllItemsInCartResult.filter(
            (cartContainsProduct) => cartContainsProduct.getProductName() == productName
        );
        
    } catch (error) {
        console.log(error);
        throw new Error('database Error'+error)
    }
};

const calculateTotalPrice = async ( {cartId} : {cartId :string}) : Promise<number> => {
    // if (!cartId) throw new Error("Cart ID is required.");

    try {
        const cartContainsProduct = await returnAllItemsInCart( cartId )

        // Log the cart items to ensure they are being fetched correctly
        // console.log("Cart items for total price calculation:", cartContainsProduct);
        if (!cartContainsProduct || cartContainsProduct.length === 0) return 0

        const totalPrice =  cartContainsProduct?.reduce((finalPrice, product) => {
            const productPrice = product.getProduct()?.getPrice();
            // if (!productPrice) throw new Error(`Price not found for product ${product.getProductName()}`);
            return finalPrice + (product.getQuantity() * (productPrice ?? 0));
        },0)

        return totalPrice ?? 0;
    }
    catch(error) {
        console.error("Error in calculateTotalPrice:", error);
        throw new Error('Error calculating total price');
    }
}
const updateProduct = async (cartId: string, name: string) => {
    try {
        if (!cartId || !name) return undefined;

        
        // Update the cartContainsProduct record
        const increaseProductQuantity = await database.cartContainsProduct.update({
            where: {
                cartId_productName: {
                    cartId: cartId,
                    productName: name
                }
            },
            data: {
                quantity: {
                    increment: 1
                },
                product: {
                    update: {
                        stock: {
                            decrement: 1
                        }
                    }
                }
            },
            include: {
                cart: true,
                product: true
            }
        });

        // Calculate the new total price
        const newTotalPrice = await calculateTotalPrice({ cartId });

        // Update the cart record with the new total price
        await database.cart.update({
            where: { id: cartId },
            data: { totalPrice: newTotalPrice }
        });

        return increaseProductQuantity;
    } catch (error) {
        console.error(error);
    }
};




export default {
    getCartItemNamesByCartId,
    deleteCartItemByCartIdAndProductName,
    getCartByCartIdAndProductName,
    // addOrUpdateProduct,
    getProductsByNameInCart,
    returnAllItemsInCart,
    addCartItem,
    deleteAllCartItems,
    updateProduct,
    calculateTotalPrice,
    decrementProductQuantity,
    incrementProductQuantity
};
