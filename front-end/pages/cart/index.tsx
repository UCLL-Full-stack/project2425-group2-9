import Header from "@/components/header";
import ProductService from "@/services/ProductService";
import styles from "../../styles/home.module.css";
import { useState, useEffect } from "react";
import { Product, CartItem as CartItemType, CartDetails } from "@/types";
import AddToCart from "@/components/cart/addtocart";
import CartService from "@/services/cart";
import Footer from "@/components/footer";
import CustomerService from "@/services/CustomerSevice";

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<Array<CartItemType>>([]);
    const [products, setProducts] = useState<Array<Product>>([]);
    const [customerId, setCustomerId] = useState<string | null>(null);

    useEffect(() => {
        const loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
        if (loggedInCustomer) {
            const customer = JSON.parse(loggedInCustomer);
            setCustomerId(customer.id);
        }
    }, []);

    useEffect(() => {
        if (customerId) {
            fetchCartDetails();
        }
    }, [customerId]);

    const fetchCartDetails = async () => {
        try {
            const cartDetails: CartDetails[] = await CartService.fetchCartDetailsByCustomerId({ customerId: customerId! });
            if (cartDetails.length > 0) {
                setCartItems(cartDetails[0].product);
            }
        } catch (error) {
            console.error('Failed to fetch cart details:', error);
        }
    };


    const getProduct = (productName: string): Product | undefined => {
        return products.find(product => product.name === productName);
    };

    const getProducts = async () => {
        const response = await ProductService.getAllProducts();
        const products = await response.json();
        setProducts(products);
    };

    const increaseQuantity = async (productName: string) => {
        if (!customerId) return;
        try {
            await CustomerService.incrementQuantity({ customerId, productName });
            incrementQuantity(productName);
        } catch (error) {
            console.error('Failed to increment product quantity:', error);
        }
    };

    const decreaseQuantity = async (productName: string) => {
        if (!customerId) return;
        try {
            await CustomerService.decrementQuantity({ customerId, productName });
            decrementQuantity(productName);
        } catch (error) {
            console.error('Failed to decrement product quantity:', error);
        }
    };

    const incrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
            )
        );
        
    };

    const decrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: Math.max((item.quantity ?? 0) - 1, 0) } : item
            )
        );
        // Call updateProduct function to update the backend
    };
    const deletCartItems = async () => {

        if (customerId) {
            const response = await CustomerService.clearCart(customerId);
            return await response.json()
        } else {
            console.error('Customer ID is null');
        }
        
    }
    const clearCart = () => {
        setCartItems([]);
        deletCartItems
       
    };

    const deleteProduct = async (productName: string) => {
        if (!customerId) return;
        try {
            await CustomerService.deleteSingleItem({customerId, productName} );
            setCartItems(prevItems => prevItems.filter(item => item.productName !== productName));
        } catch (error) {
            console.error('Failed to delete product from cart:', error);
        }
    };

    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
        const cartTabElement = document.querySelector("header nav a:nth-child(2)");
        if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    };

    useEffect(() => {
        getProducts();
        highlightCurrentTabInMenu();
    }, []);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <button onClick={clearCart}>Clear Cart</button>
                <section className={styles.products}>
                    {cartItems.length >0 ? (
                        <AddToCart
                            cartItems={cartItems}
                            getProduct={getProduct}
                            incrementQuantity={increaseQuantity}
                            decrementQuantity={decreaseQuantity}
                            products={products}
                            clearCart={clearCart}
                            deleteCartItem={deleteProduct}
                        />
                    ) : <p>your cart is empty</p>}
                </section>
               
            </main>
            <Footer />
        </>
    );
};

export default Cart;
