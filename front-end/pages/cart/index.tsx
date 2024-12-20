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
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Cart: React.FC = () => {
    const { t } = useTranslation();
    const { cartItems, setCartItems, updateTotalItems } = useCart();
    const [products, setProducts] = useState<Array<Product>>([]);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [orderMessage, setOrderMessage] = useState<string | null>(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [error, setError] = useState<string | null>(null)


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
                setTotalPrice(cartDetails[0].totalPrice);
                updateTotalItems();
            }
        } catch (error) {
            setError(`${error}`);
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

        setIsPlacingOrder(true);

        try {
            const res = await CustomerService.placeAnOrder(customerId);
            const message = await res.text();
            if (res.ok) {
                clearCart()
                router.push({
                    pathname: '/cart/order',
                    query: { orderMessage: message }
                });
            } else {
                setOrderMessage(message);
                setTimeout(() => {
                    setOrderMessage(null);
                    setIsPlacingOrder(false);
                }, 4000); 
            }
        } catch (error) {
            console.error(error);
            setOrderMessage(`${error}`);
            setTimeout(() => {
                setOrderMessage(null);
                setIsPlacingOrder(false);
            }, 4000); 
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
            
            if (cartItems.length === 0)
                setOrderMessage('you can not clear an empty cart');
                setTimeout(() => setOrderMessage(null), 2000);
            // await CustomerService.clearCart(customerId);
            setCartItems([]);
            updateTotalItems();

        } catch (error) {
            setOrderMessage(`${error}`)
            setTimeout(() => setOrderMessage(null), 2000)
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

    

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            <Header />

            <main className={styles.main}>
                {error && <p className="text-red-800">{error}</p>}
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
                            totalPrice={totalPrice}
                        />
                    ) : <p>Your Cart  is currently empty. Add items to fill your cart</p>}
                </section>
                <section className={`${styles.flex} mt-4`}>
                <div className="flex space-x-4">
                        <button onClick={clearCart} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                            {t('clearCart')}
                        </button>
                        <button onClick={placeAnOrder} disabled={isPlacingOrder} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                            {isPlacingOrder ? t('placingOrder') : t('placeOrder')}
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export const getServerSideProps = async (context: { locale: any; }) => {
    const { locale } = context;
  
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
    };
  };

export default Cart;