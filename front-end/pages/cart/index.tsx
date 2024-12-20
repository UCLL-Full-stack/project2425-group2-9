import Header from "@/components/header";
import ProductService from "@/services/ProductService";
import styles from "../../styles/home.module.css";
import { useState, useEffect } from "react";
import { Product, CartItem as CartItemType, CartDetails } from "@/types";
import AddToCart from "@/components/orderandcart/addtocart";
import CartService from "@/services/cart";
import Footer from "@/components/footer";
import CustomerService from "@/services/CustomerSevice";
import { useRouter } from "next/router";
import { useCart } from '../../components/cartComponentProps';
import { useTranslation } from 'next-i18next';

const Cart: React.FC = () => {
    const { t } = useTranslation('common');
    const { cartItems, setCartItems, updateTotalItems } = useCart();
    const [products, setProducts] = useState<Array<Product>>([]);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [orderMessage, setOrderMessage] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const loggedInCustomer = sessionStorage.getItem('loggedInCustomer');
        if (loggedInCustomer) {
            const customer = JSON.parse(loggedInCustomer);
            setCustomerId(customer.id);
        }
    }, []);

    useEffect(() => {
        console.log("CartPage mounted");
        if (customerId) {
            fetchCartDetails();
        }
    }, [customerId]);

    const fetchCartDetails = async () => {
        try {
            const cartDetails: CartDetails[] = await CartService.fetchCartDetailsByCustomerId({ customerId: customerId! });
            if (cartDetails.length > 0) {
                setCartItems(cartDetails[0].product);
                updateTotalItems();
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

    const placeAnOrder = async () => {
        if (!customerId) return;

        try {
            const res = await CustomerService.placeAnOrder(customerId);
            const message = await res.text();
            if (res.ok) {
                router.push({
                    pathname: '/cart/order',
                    query: { orderMessage: message }
                });
            } else {
                setOrderMessage(message);
            }
        } catch (error) {
            console.error(error);
            setOrderMessage(`${error}`);
        }
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
        updateTotalItems();
    };

    const decrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: Math.max((item.quantity ?? 0) - 1, 0) } : item
            )
        );
        updateTotalItems();
    };

    const clearCart = async () => {
        if (!customerId) return;
        try {
            await CustomerService.clearCart(customerId);
            setCartItems([]);
            updateTotalItems();
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    const deleteProduct = async (productName: string) => {
        if (!customerId) return;
        try {
            await CustomerService.deleteSingleItem({ customerId, productName });
            setCartItems(prevItems => prevItems.filter(item => item.productName !== productName));
            updateTotalItems();
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
                <button onClick={clearCart}>{t('clearCart')}</button>
                <section className={styles.products}>
                    {cartItems.length > 0 ? (
                        <AddToCart
                            cartItems={cartItems}
                            getProduct={getProduct}
                            incrementQuantity={increaseQuantity}
                            decrementQuantity={decreaseQuantity}
                            products={products}
                            clearCart={clearCart}
                            deleteCartItem={deleteProduct}
                        />
                    ) : <p>{t('yourCartIsEmpty')}</p>}
                </section>
                <section>
                    <div className="px-2 py-1 ml-2 bg-green-300 text-white rounded hover:bg-gray-600">
                        <button onClick={placeAnOrder}>{t('placeOrder')}</button>
                        {orderMessage && <p>{orderMessage}</p>}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Cart;