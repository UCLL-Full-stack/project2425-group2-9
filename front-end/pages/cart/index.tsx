import Header from "@/components/header";
import Product from "@/components/product";
import ProductService from "@/services/ProductService";
import styles from "../../styles/home.module.css";
import { useState, useEffect } from "react";
import CartService from "@/services/CartService";
import CartItem from "@/components/cartItem";

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    const [products, setProducts] = useState<Array<Product>>([]);

    const fetchCartById = async (cartId: number) => {
        const response = await CartService.fetchCartItemsByCartId(cartId);
        const cartItemss = await response.json();
        setCartItems(cartItemss);
    };

    const fetchProducts = async () => {
      const response = await ProductService.getAllProducts();
      const productss = await response.json();
      setProducts(productss);
    };

    const updateProduct = async () => {
        CartService.updateOrAddCartItem();
    };
  
    useEffect(() => {
    }, []);
  
    const incrementQuantity = (productName: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === productName ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
            )
        );
        // updateProduct();
    };

    const decrementQuantity = (name: string) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productName === name ? { ...item, quantity: (item.quantity ? item.quantity - 1: 0) } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    useEffect(() => {
      fetchProducts();
      fetchCartById(3); // TODO: Cart id should not be hardcoded!
      highlightCurrentTabInMenu();
    }, []);

    // Highlight current tab in header.
    const highlightCurrentTabInMenu = () => {
        const cartTabElement = document.querySelector("header nav a:nth-child(2)");
        if (cartTabElement) cartTabElement.setAttribute("style", "background-color: green;");
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <button onClick={clearCart} >Clear Cart</button>
                <section className={styles.products}>
                {
                    cartItems &&
                    (<CartItem 
                    cartItems={cartItems}
                    products={products}
                    incrementQuantity={incrementQuantity}
                    decrementQuantity={decrementQuantity}
                    clearCart={clearCart}
                    />)
                }
                </section>
            </main>  
        </>
    );

};

export default Cart;